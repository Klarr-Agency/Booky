/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rybgkg359i2537w")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pdmjzpr0",
    "name": "label",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rybgkg359i2537w")

  // remove
  collection.schema.removeField("pdmjzpr0")

  return dao.saveCollection(collection)
})
