require File.dirname(__FILE__) + "/spec_helper"
require "easy_sync"

EM.describe EasySync do
  after do
    done
  end
  
  it "should unpack changetset" do
    cs = EasySync::Changeset.unpack("Z:1a>g|1=5=a*0+2f$ there")
    cs.size.should == 46
    cs.total_size.should == 62
    cs.ops.should == "|1=5=a*0+2f$"
    cs.char_bank.should == " there"
  end
  
  it "should apply adding changeset to text" do
    text = "ohae\nhi\n"
    
    text = EasySync::Changeset.unpack("Z:8>6|1=5=2*0+6$ there").apply_to_text(text)
    text.should == "ohae\nhi there\n"
    
    text = EasySync::Changeset.unpack("Z:e>1=3*0+1$i").apply_to_text(text)
    text.should == "ohaie\nhi there\n"
  end
  
  it "should apply deleting changeset to text" do
    text = "\n"
    
    text = EasySync::Changeset.unpack("Z:1>6*0+6$123456").apply_to_text(text)
    text.should == "123456\n"
    
    text = EasySync::Changeset.unpack("Z:7<1=1-1$").apply_to_text(text)
    text.should == "13456\n"
  end
  
  it "should merge attributions" do
    text = "ohae\nhi\n"
    attributions = EasySync::Changeset.create_attributions(text)
    
    attributions = EasySync::Changeset.unpack("Z:8>6|1=5=2*0+6$ there").apply_to_attributions(attributions)
    attributions.should == "|1+5+2*0+6|2+2"
    
    attributions = EasySync::Changeset.unpack("Z:e>1=3*1+1$i").apply_to_attributions(attributions)
    attributions.should == "+3*1+1|1+2+2*0+6|2+2"
  end
  
  it "should apply deleting changeset to attributions" do
    text = "\n"
    attributions = EasySync::Changeset.create_attributions(text)
    
    attributions = EasySync::Changeset.unpack("Z:1>6*0+6$123456").apply_to_attributions(attributions)
    attributions.should == "*0+6|2+2"
    
    attributions = EasySync::Changeset.unpack("Z:7<1=1-1$").apply_to_attributions(attributions)
    attributions.should == "*0+5|2+2"
  end
  
  it "should create initial attributions from text" do
    EasySync::Changeset.create_attributions("\n").should == "|2+2"
    EasySync::Changeset.create_attributions("ohaie\nthere\n").should == "|3+d"
  end
  
  it "should apply diff with multibyte strings" do
    text = "\303\251\n\n"
    text = EasySync::Changeset.unpack("Z:3>1=1*1+1$\303\251").apply_to_text(text)
    text.should == "\303\251\303\251\n\n"
  end

  it "should create attributions for multibyte strings" do
    attributions = EasySync::Changeset.create_attributions("\303\251\303\251")
    attributions.should == "|1+3"
  end
end