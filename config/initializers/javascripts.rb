# Add javascript files included by `javascript_include_tag :defaults` here
ActionView::Helpers::AssetTagHelper::JAVASCRIPT_DEFAULT_SOURCES.concat %w(jquery.cookie)
ActionView::Helpers::AssetTagHelper::reset_javascript_include_default