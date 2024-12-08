/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "h5ldnsxyzjh37ts",
    "created": "2024-12-08 16:15:07.080Z",
    "updated": "2024-12-08 16:15:07.080Z",
    "name": "transactionLabels",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "amjz81cz",
        "name": "transactionId",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "rybgkg359i2537w",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "60nkq2ow",
        "name": "userId",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "yejgghzs",
        "name": "labelId",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "li2z50istdbbvt2",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != \"\" && userId = @request.auth.id",
    "viewRule": "@request.auth.id != \"\" && userId = @request.auth.id",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\" && userId = @request.auth.id",
    "deleteRule": "@request.auth.id != \"\" && userId = @request.auth.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("h5ldnsxyzjh37ts");

  return dao.deleteCollection(collection);
})
