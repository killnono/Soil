/**
 *
 * @authors killnono
 * @version 1.0
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var BookSchema = new Schema({
    name: String,
    type: String,
    borrow: String,
    desc: String,
    isBuy: {
        type: Boolean,
        default: false
    }
});
mongoose.model('Book', BookSchema);