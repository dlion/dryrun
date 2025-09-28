#!/usr/bin/env ruby
# frozen_string_literal: true

require 'yaml'
require 'time'
require 'fileutils'

SOURCE_DIR = File.expand_path('../old_blog/_posts', __dir__)
TARGET_DIR = File.expand_path('../_posts', __dir__)

FileUtils.mkdir_p(TARGET_DIR)

# Generate a short description from the markdown body.
def extract_description(body)
  cleaned = body.gsub("\r\n", "\n").gsub("\r", "\n").strip
  segments = cleaned.split(/\n{2,}/).map(&:strip)

  segments.each do |segment|
    next if segment.empty?
    next if segment.start_with?('#')
    next if segment.start_with?('```')
    next if segment.start_with?('>')
    next if segment.start_with?('![')
    next if segment.start_with?('{:')

    text = segment.dup
    text.gsub!(/\{:[^}]+\}/, '')
    text.gsub!(/!\[[^\]]*\]\([^\)]+\)/, '')
    text.gsub!(/\[(.*?)\]\([^\)]+\)/, '\\1')
    text.gsub!(/`([^`]+)`/, '\\1')
    text.gsub!(/\*\*(.*?)\*\*/, '\\1')
    text.gsub!(/\*(.*?)\*/, '\\1')
    text.gsub!(/<[^>]+>/, '')
    text.gsub!(/\s+/, ' ')
    text.strip!
    next if text.nil? || text.empty?
    return truncate(text, 180)
  end

  fallback = cleaned.gsub(/```.*?```/m, '').gsub(/<[^>]+>/, '').gsub(/\s+/, ' ').strip
  truncate(fallback, 180)
end

def truncate(text, max_length)
  return text if text.length <= max_length

  truncated = text[0...max_length]
  truncated = truncated.sub(/\s+\S*\z/, '')
  truncated = truncated.strip
  truncated.empty? ? text[0...max_length] + '…' : truncated + '…'
end

def humanize_tag(tag)
  trimmed = tag.to_s.strip
  return trimmed if trimmed.empty?

  if trimmed.match?(/\A[[:lower:][:digit:]\s]+\z/)
    trimmed.split(/\s+/).map { |word| word.capitalize }.join(' ')
  else
    trimmed
  end
end

def normalize_tags(raw_categories)
  categories = case raw_categories
               when Array then raw_categories
               when String
                 raw_categories.split(',')
               else
                 []
               end

  seen = {}
  categories.map { |cat| humanize_tag(cat) }
            .reject(&:empty?)
            .map { |cat| cat.gsub(/\s+/, ' ') }
            .each_with_object([]) do |cat, acc|
    key = cat.downcase
    next if seen[key]

    acc << cat
    seen[key] = true
  end
end

def escape_double_quotes(text)
  text.to_s.gsub('"', '\\"')
end

def format_multiline_list(key, values)
  return nil if values.nil? || values.empty?

  lines = ["#{key}:"]
  values.each do |value|
    needs_quotes = value.match?(/[:#\-]|\s/)
    entry = needs_quotes ? '"' + escape_double_quotes(value) + '"' : value
    lines << "  - #{entry}"
  end
  lines
end

Dir.glob(File.join(SOURCE_DIR, '*.md')).sort.each do |source|
  raw = File.read(source, encoding: 'UTF-8')
  normalized = raw.gsub("\r\n", "\n").gsub("\r", "\n")

  unless normalized.start_with?('---')
    warn "Skipping #{source}: missing front matter"
    next
  end

  content = normalized.sub(/\A---\s*\n/, '')
  front_matter, body = content.split(/\n---\s*\n/, 2)

  if body.nil?
    warn "Skipping #{source}: cannot split front matter"
    next
  end

  data = YAML.safe_load(front_matter, permitted_classes: [Date, Time], aliases: true) || {}

  title = data['title']&.to_s&.strip
  if title.nil? || title.empty?
    warn "Skipping #{source}: missing title"
    next
  end

  description = extract_description(body)
  cover = data['cover']&.to_s&.strip
  cover = nil if cover && cover.empty?
  excerpt_separator = data['excerpt_separator']&.to_s&.strip
  tags = normalize_tags(data['categories'])

  new_lines = []
  new_lines << '---'
  new_lines << %(title: "#{escape_double_quotes(title)}")
  unless description.nil? || description.empty?
    new_lines << %(description: "#{escape_double_quotes(description)}")
  end

  if tags && !tags.empty?
    new_lines.concat(format_multiline_list('tags', tags))
  end

  if cover
    new_lines << %(cover: "#{escape_double_quotes(cover)}")
  end

  if excerpt_separator && !excerpt_separator.empty?
    new_lines << %(excerpt_separator: "#{escape_double_quotes(excerpt_separator)}")
  end

  new_lines << '---'
  new_lines << ''
  new_lines << body.lstrip

  target_basename = File.basename(source)
  target_basename = target_basename.sub(/\.md\.md\z/, '.md')
  target_path = File.join(TARGET_DIR, target_basename)

  File.write(target_path, new_lines.join("\n"))
end
