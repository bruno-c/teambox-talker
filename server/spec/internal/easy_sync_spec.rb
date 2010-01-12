require File.dirname(__FILE__) + "/spec_helper"
require "easy_sync"

describe EasySync do
  it "should apply changeset to a text" do
    text = "ohae\nhi\n"
    
    text = EasySync::Changeset.unpack("Z:8>6|1=5=2*0+6$ there").apply_to_text(text)
    text.should == "ohae\nhi there\n"
    
    text = EasySync::Changeset.unpack("Z:e>1=3*0+1$i").apply_to_text(text)
    text.should == "ohaie\nhi there\n"
  end
  
  it "should apply changeset to attributions" do
    text = "ohae\nhi\n"
    attributions = EasySync::Changeset.create_attributions(text)
    
    attributions = EasySync::Changeset.unpack("Z:8>6|1=5=2*0+6$ there").apply_to_attributions(attributions)
    attributions.should == "|1+5+2*0+6|2+2"
    
    attributions = EasySync::Changeset.unpack("Z:e>1=3*0+1$i").apply_to_attributions(attributions)
    attributions.should == "+3*0+1|1+2+2*0+6|2+2"
  end
  
  it "should create initial attributions from text" do
    EasySync::Changeset.create_attributions("\n").should == "|2+2"
    EasySync::Changeset.create_attributions("ohaie\nthere\n").should == "|3+d"
  end
end