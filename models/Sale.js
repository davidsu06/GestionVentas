const mongoose = require('mongoose');

const SalesSchema = mongoose.Schema({
    sale: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    saleReference: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Sale', SalesSchema);