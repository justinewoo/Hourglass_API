var ObjectId = require('mongodb').ObjectId;
const fs = require('fs');

module.exports = function(app, db) {
    app.get('/', (req, res) => {
        res.send("hi");
    })

    app.post('/hourglass_db/', (req, res) => {
        console.log('sup')
        var todo = req.body.todo;
        var type = req.body.type;
        if (type == "user") {
            if (todo == "register") {
                var reg = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: req.body.password,
                    username: req.body.username
                }
                db.collection('users').insert(reg, (err, result) => {
                    if (err) {
                        res.send(err)
                    } else {
                        res.send("Registered " + JSON.stringify(reg))
                    }
                })
                return
            }
        }
    })
}
