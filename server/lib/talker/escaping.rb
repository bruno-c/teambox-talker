module Talker
  module Escaping
    private
      def quote(s)
        return "" if s.nil?
        s.gsub(/\\/, '\&\&').gsub(/'/, "''")
      end
  end
end