require File.dirname(__FILE__) + "/../spec_helper"

describe Event do
  describe "on creation" do
    it "assigns payload object" do
      payload = {"time" => 1258314754,"type" => "message","content" => "ohaie","user" => {"name" => "ma","id" => 1,"email" => "macournoyer@gmail.com"}}

      Factory.create(:join_event, :payload_object => payload).payload_object.should_not be_nil
      Factory.create(:message_event, :payload_object => payload).payload_object.should_not be_nil
    end

    context "when manually forced an invalid payload" do
      it "ignores it" do
        %w[ohnoz {"ohnoz"].each do |invalid_payload|
          Factory.build(:join_event, :payload_object => invalid_payload).payload_object.should be_nil
          Factory.build(:message_event, :payload_object => invalid_payload).payload_object.should be_nil
        end
      end
    end
  end

end
