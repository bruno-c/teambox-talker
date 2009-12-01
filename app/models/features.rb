class Features
  LEVELS = {}
  
  def initialize(level, features)
    @features = features
    LEVELS[level] = self
  end
  
  def method_missing(method, *args)
    if @features.key?(method)
      @features[method]
    else
      super
    end
  end
  
  def self.[](level)
    LEVELS[level.to_sym] || raise(ArgumentError, "Unknow feature level: #{level.inspect}")
  end
  
  
  # Edit feature level limits here
  
  new :free,     :ssl => false,
                 :max_connections => 4,
                 :max_storage => 10.megabytes
  
  new :basic,    :ssl => true,
                 :max_connections => 12,
                 :max_storage => 1.gigabytes
  
  new :plus,     :ssl => true,
                 :max_connections => 25,
                 :max_storage => 3.gigabytes
  
  new :premium,  :ssl => true,
                 :max_connections => 60,
                 :max_storage => 10.gigabytes
  
  new :max,      :ssl => true,
                 :max_connections => 100,
                 :max_storage => 25.gigabytes
end