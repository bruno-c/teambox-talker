class Features
  LEVELS = {}
  
  def initialize(level, features)
    @features = features
    LEVELS[level] = self
  end
  
  def [](name)
    @features[name]
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
  
  new :free,      :ssl             => false,
                  :max_connections => 4,
                  :max_storage     => 10.megabytes,
                  :private_rooms   => false,
                  :log_history     => 1.week
  
  new :bootstrap, :ssl             => true,
                  :max_connections => 8,
                  :max_storage     => 1.gigabytes,
                  :private_rooms   => false,
                  :log_history     => 1.month
  
  new :startup,   :ssl             => true,
                  :max_connections => 12,
                  :max_storage     => 3.gigabytes,
                  :private_rooms   => true,
                  :log_history     => nil
  
  new :basic,     :ssl             => true,
                  :max_connections => 30,
                  :max_storage     => 10.gigabytes,
                  :private_rooms   => true,
                  :log_history     => nil
  
  new :premium,   :ssl             => true,
                  :max_connections => 60,
                  :max_storage     => 25.gigabytes,
                  :private_rooms   => true,
                  :log_history     => nil
  
  new :big,       :ssl             => true,
                  :max_connections => 100,
                  :max_storage     => 40.gigabytes,
                  :private_rooms   => true,
                  :log_history     => nil

end