#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'

POSTS_DIR = File.expand_path('../_posts', __dir__)

Dir.glob(File.join(POSTS_DIR, '*.md')).each do |path|
  original = File.read(path, encoding: 'UTF-8')
  lines = original.lines
  first = lines.index { |line| line.strip == '---' }
  next unless first == 0
  second = lines[(first + 1)..].index { |line| line.strip == '---' }
  next if second.nil?
  boundary = first + 1 + second
  front = lines[0..boundary]
  body_lines = lines[(boundary + 1)..] || []
  body = body_lines.join

  updated = body.gsub(/\]\((\/assets\/[^\s)]+)([^)]*)\)/) do |_match|
    path_part = Regexp.last_match(1)
    rest = Regexp.last_match(2) || ''
    next _match if path_part.include?('{{')
    "]({{ '#{path_part}' | relative_url }}#{rest})"
  end

  updated = updated.gsub(/\]\((\/sviluppatori_italiani\.png)([^)]*)\)/) do |_match|
    rest = Regexp.last_match(2) || ''
    "]({{ '/assets/images/posts/sviluppatori_italiani.png' | relative_url }}#{rest})"
  end

  if updated != body
    File.write(path, front.join + updated, mode: 'w', encoding: 'UTF-8')
  end
end
