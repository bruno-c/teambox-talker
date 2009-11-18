module Talker
  module Escaping
    private
      def quote(s)
        return "" if s.nil?
        s.to_s.gsub(/\\/, '\&\&').gsub(/'/, "''")
      end
  end
end