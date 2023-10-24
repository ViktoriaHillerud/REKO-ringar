import mongoose from "mongoose";

interface IEvent {
  start: Date;
  end: Date;
  title: string;
  desc?: string;
  uid: string;
}

interface EventModel extends mongoose.Model<EventDoc> {
  build(attr: IEvent): EventDoc;
}

export interface EventDoc extends mongoose.Document {
  start: Date;
  end: Date;
  title: string;
  desc?: string;
  uid: string;
}

const eventSchema = new mongoose.Schema({
	start: {
	  type: Date,
	  validate: {
		validator: function (this: any) {
		  return this.isNew || (this.start !== undefined);
		},
		message: "Start date is required during creation",
	  },
	},
	end: {
	  type: Date,
	  validate: {
		validator: function (this: any) {
		  if (this._deleted) return true; // Allow null or undefined during deletion
		  return this.isNew || (this.end !== undefined);
		},
		message: "End date is required during creation",
	  },
	},
	title: {
	  type: String,
	  validate: {
		validator: function (this: any) {
		  return this.isNew || (this.title !== undefined);
		},
		message: "Title is required during creation",
	  },
	},
	desc: {
	  type: String,
	},
	uid: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: "User",
	  validate: {
		validator: function (this: any) {
		  return this.isNew || (this.uid !== undefined);
		},
		message: "User ID is required during creation",
	  },
	},
  });
  

const Event = mongoose.model<EventDoc, EventModel>("Event", eventSchema);

export { Event, eventSchema };
