#!/usr/bin/env node

"use strict";
var util = require('util');
var db = require('./db').dbmaster;
var debug = require('debug')('model:pending_queue');


var pending_queue = {

  table: db.define({
    'name': 'pending_queue',
    'columns': ['id', 'user', 'data']
  }),

  select: function(ops, cb) {
    var table = this.table;
    var filters = [];
    var query = table;
    var selectedFields = [];

    if (ops.columns) {
      ops.columns.forEach(function(t) {
        if (table[t]) {
          selectedFields.push(table[t]);
        }
      });
    }

    if (!selectedFields.length) {
      selectedFields = [table.star()];
    }

    ['id', 'user'].forEach(function(t) {
      if (ops[t]) {
        if (util.isArray(ops[t]) && ops[t].length > 0) {
          filters.push(table[t].in(ops[t]));
        } else {
          filters.push(table[t].equals(ops[t]));
        }
      }
    });

    query = table.select(selectedFields).from(query);
    if (filters.length) {
      query = query.where.apply(query, filters);
    }

    query = query.order(table['id']['ascending']);

    if (ops.limit) {
      query = query.limit(ops.limit);
    }

    query.exec(cb);
  },

  create: function(data, cb) {
    var query = this.table.insert(data);
    query.exec(cb);
  },

  update: function(keys, alert, callback) {
    this.table.update(alert).where(keys).exec(callback);
  },

  byId: function(params, cb) {
    this.select(params, cb);
  },

  byCategoryId: function(params, cb) {
    this.select(params, cb);
  },

  remove: function(id, cb) {
    var table = this.table;
    table.delete().where(table.id.equals(id)).exec(function(err, res) {
      if (!err && res.affectedRows === 0) {
        err = new Error('Not Found.');
      }
      cb(err, res);
    });
  },

  insert: function(data, cb) {
    var query = this.table.insert(data);
    var str = ' on duplicate key update user=values(user), data=values(data)';
    var temp = query.toQuery();
    temp.text = temp.text.concat(str);
    db.query(temp.text, temp.values, cb);
  },

  all: function(cb) {
    var options = {
      available: true,
    };
    this.select(options, cb);
  }
  
};

module.exports = pending_queue;