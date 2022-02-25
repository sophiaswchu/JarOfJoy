import {ObjectId} from 'bson';

class Joy {
  constructor({
    date,
    content,
    partition,
    id = new ObjectId(),
  }) {
    this._partition = partition;
    this._id = id;
    this.date = date;
    this.content = content;
  }

  static schema = {
    name: 'Joy',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      date: 'string',
      content: 'string',
    },
    primaryKey: '_id',
  };
}

export {Joy};
