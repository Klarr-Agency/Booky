/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rybgkg359i2537w")

  collection.listRule = "@request.auth.id != \"\" && userId = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rybgkg359i2537w")

  collection.listRule = "@request.auth.id != \"\""

  return dao.saveCollection(collection)
})
