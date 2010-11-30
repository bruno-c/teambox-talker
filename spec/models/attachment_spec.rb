# encoding: utf-8
require File.dirname(__FILE__) + "/../spec_helper"

describe Attachment do

  describe "just initialized" do

    describe "extension" do
      context "with no filename" do
        it "is nil" do
          subject.ext.should be_nil
        end
      end
      context "with a filename with a jpg extension" do
        it "is set to jpg" do
          Factory.build(:attachment, :upload_file_name => "ohaie.jpg").ext.should == "jpg"
        end
      end
      context "with a filename with no extension" do
        it "is blank" do
          Factory.build(:attachment, :upload_file_name => "ohaie").ext.should be_blank
        end
      end
    end

    describe "basename" do
      context "with no filename" do
        it "is nil" do
          subject.basename.should be_nil
        end
      end
      context "with a filename with an extension" do
        it "is set to the name" do
          Factory.build(:attachment, :upload_file_name => "ohaie.jpg").basename.should == "ohaie"
        end
      end
      context "with a filename with no extension" do
        it "is set to the name" do
          Factory.build(:attachment, :upload_file_name => "ohaie").basename.should == "ohaie"
        end
      end
      it "makes the basename url-friendly" do
        Factory.build(:attachment, :upload_file_name => "Screen shot 2009-11-25 at 10.48.27 AM").basename.should == "screen-shot-2009-11-25-at-1048"
      end
      it "sanitizes odd characters" do
        Factory.build(:attachment, :upload_file_name => "éé").basename.should == ""
      end
    end
  end
 
  describe "storage limit" do
    it "does not complain with small files" do
      Factory.build(:attachment, :room => Room.first, :upload_file_size => 1.kilobyte).tap do |attachment|
        attachment.valid?
        attachment.errors.on(:base).should be_nil
      end
    end
    it "complains with big files" do
      Factory.build(:attachment, :room => Room.first, :upload_file_size => 100.gigabytes).tap do |attachment|
        attachment.valid?
        attachment.errors.on(:base).should_not be_nil
      end
    end
  end
  
  it "sets the url" do
    Factory(:attachment).url.should match "s3.amazonaws.com/talker-test/attachments"
  end
end
