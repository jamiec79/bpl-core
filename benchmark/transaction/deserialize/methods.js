const {
    Transactions
} = require('@blockpool-io/crypto')

exports.deserialize = data => {
    return Transactions.Deserializer.deserialize(data)
}
