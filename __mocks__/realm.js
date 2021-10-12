// https://github.com/realm/realm-js/issues/370#issuecomment-270849466
class Realm {
  static seededData = {};

  constructor(params) {
    this.schema = {};
    this.callbackList = [];
    this.data = {};
    this.schemaCallbackList = {};
    params.schema.forEach(schema => {
      const name = schema.name || schema.schema.name;
      this.data[name] = Realm.seededData[name] || {};
    });
    params.schema.forEach(schema => {
      const name = schema.name || schema.schema.name;
      this.schema[name] = schema;
    });
    this.lastLookedUpModel = null;
  }

  _createClassInstance(Model, data) {
    var obj = Object.create(Model.prototype);
    return Object.assign(obj, data);
  }

  objects(schemaName) {
    this.lastLookedUpModel = schemaName;
    const objects = Object.values(this.data[schemaName]).map(data => {
      return this._createClassInstance(this.schema[schemaName], data);
    });
    objects.values = () => objects;
    objects.sorted = () =>
      this.compareFunc ? objects.sort(this.compareFunc) : objects.sort();
    objects.addListener = cb => {
      if (this.schemaCallbackList[schemaName]) {
        this.schemaCallbackList[schemaName].push(cb);
      } else {
        this.schemaCallbackList[schemaName] = [cb];
      }
    };
    objects.removeListener = () => {};
    objects.filtered = this.filtered
      ? this.filtered.bind(this, schemaName)
      : () => objects;
    return objects;
  }

  write(fn) {
    this.writing = true;
    fn();
    this.writing = false;
  }

  create(SchemaClass, object) {
    const schemaName = SchemaClass.schema.name;
    const modelObject = object;
    const properties = this.schema[schemaName].schema.properties;
    Object.keys(properties).forEach(key => {
      if (modelObject[key] === undefined) {
        if (typeof properties[key] === 'object' && properties[key].optional) {
          modelObject[key] = null;
        }
        if (
          typeof properties[key] === 'object' &&
          ['list', 'linkingObjects'].includes(properties[key].type)
        ) {
          modelObject[key] = [];
          modelObject[key].filtered = () => [];
          modelObject[key].sorted = () => [];
        }
      }
    });

    const modelId = modelObject._id.toHexString
      ? modelObject._id.toHexString()
      : modelObject._id;
    this.data[schemaName][modelId] = modelObject;
    if (this.writing) {
      if (this.schemaCallbackList[schemaName]) {
        this.schemaCallbackList[schemaName].forEach(cb =>
          cb(schemaName, {
            insertions: {length: 1},
            modifications: {length: 0},
            deletions: {length: 0},
          }),
        );
      }
      this.callbackList.forEach(cb => {
        cb();
      });
    }
    return this._createClassInstance(SchemaClass, modelObject);
  }

  objectForPrimaryKey(model, id) {
    this.lastLookedUpModel = model;
    const idStr = id.toHexString ? id.toHexString() : id;
    return this._createClassInstance(
      this.schema[model],
      this.data[model][idStr],
    );
  }

  delete(object) {
    if (this.lastLookedUpModel || object.model) {
      const model = object.model ? object.model : this.lastLookedUpModel;
      if (Array.isArray(object)) {
        object.forEach(item => {
          delete this.data[model][item.id];
        });
      }
      delete this.data[model][object.id];
      if (this.writing) {
        if (this.schemaCallbackList[model]) {
          this.schemaCallbackList[model].forEach(cb =>
            cb(model, {
              insertions: {length: 0},
              modifications: {length: 0},
              deletions: {length: 1},
            }),
          );
        }
        this.callbackList.forEach(cb => {
          cb();
        });
      }
    }
  }

  deleteAll() {
    Object.keys(this.schema).forEach(key => {
      if (this.writing && this.schemaCallbackList[this.schema[key].name]) {
        this.schemaCallbackList[this.schema[key].name].forEach(cb =>
          cb(key, {
            insertions: {length: 0},
            modifications: {length: 0},
            deletions: {
              length: Object.values(this.data[this.schema[key].name]).length,
            },
          }),
        );
      }
      this.data[this.schema[key].name] = {};
    });
    if (this.writing) {
      this.callbackList.forEach(cb => {
        cb();
      });
    }
  }

  addListener(event, callback) {
    this.callbackList.push(callback);
  }

  prepareData(schemaName, objects) {
    objects.forEach(object => {
      this.create(schemaName, object);
    });
  }
}

Realm.Object = class Object {
  isValid() {
    return true;
  }
};

Realm.App = class App {
  constructor(realmAppId) {
    if (!realmAppId) {
      throw new Error(
        'Expected either a configuration object or an app id string.',
      );
    }
    this.realmAppId = realmAppId;
    this.currentUser = null;
  }
};

module.exports = Realm;
