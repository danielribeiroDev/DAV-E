
///: very simple implementation of memcahed to store agent instances and chats
/*
    this must be partially replaced by a database implementation to persist the chat history
*/
export default class Memcached {
    _data = {
        "agents": {

        },
        "chat_history" : {

        },
    }

    add(where, key, value) {
        this._data[where][key] = value
        return this.get(where, key)
    }

    get(where, key) {
        return this._data[where][key] || null
    }

    append(where, key, value) {
        this._data[where][key].push(value)
    }
}
