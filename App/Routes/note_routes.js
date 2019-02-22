var ObjectId = require('mongodb').ObjectId;
const fs = require('fs');

module.exports = function(app, db) {
    app.get('/', (req, res) => {
        res.send("hi");
    })

    app.post('/hourglass_db/', (req, res) => {
        console.log('sup')
        var type = req.body.type;
        var todo = req.body.todo;
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
            } else if (todo == "login") {
                var userQuery = {
                    username: req.body.username,
                    password: req.body.password
                }
                db.collection('users').findOne(userQuery, (err, item) => {
                    if (err) {
                        res.send(err)
                    } else {
                        res.send(item)
                    }
                })
                return
            } else if (todo == "getAllUsers") {
              db.collection('users').find({}).toArray(function(err, docs) {
                if (err) {
                    throw err;
                } else {
                    res.send(docs);
                };
              });
              return;
            } else if (todo == "postMessage") {
              var postMessageData = {
                time: req.body.time,
                day: req.body.day,
                month: req.body.month,
                year: req.body.year,
                message: req.body.message,
                receiver: req.body.receiver,
                sender: req.body.sender
              }
              db.collection('messages').insert(postMessageData, (err, result) => {
                if (err) {
                    res.send(err)
                } else {
                    res.send("Successfully sent " + JSON.stringify(postMessageData))
                }
              })
              return
            } else if (todo == "getMessage") {
              var getMessageData = {
                sender: req.body.sender,
                receiver: req.body.receiver
              }
              db.collection('messages').find(getMessageData).toArray(function(err, docs) {
                if (err) {
                  throw err
                } else {
                  res.send(docs)
                };
              });
              return;
            } else if (todo == "postScheduledMessage") {
              var postMessageData = {
                username: req.body.username,
                listOfMessages: []
              }
              db.collection('scheduled_messages').insert(postMessageData, (err, result) => {
                if (err) {
                    res.send(err)
                } else {
                    res.send("Successfully sent " + JSON.stringify(postMessageData))
                }
              })
              return
            } else if (todo == "getAllScheduledMessages") {
              var getSchedulesData = {
                username: req.body.username
              }
              db.collection('scheduled_messages').findOne(getSchedulesData, (err, item) => {
                if (err) {
                  res.send(err)
                } else {
                  res.send(item)
                }
              })
              return
            }
            var getMessageData = {
              username: req.body.username
            }
            var updateMessageData = {
              sender: req.body.sender,
              receiver: req.body.receiver,
              message: req.body.message,
              year: req.body.year,
              month: req.body.month,
              day: req.body.day,
              time: req.body.time
            }
            db.collection('scheduled_messages').findOne(getMessageData, (err, item) => {
              if (err) {
                res.send(err)
              } else {
                var updated = item
                //console.log(updated)

                updated._id = ObjectId(updated._id)
                if (todo == "updateMessage") {
                  var newMessage = req.body.newMessage
                  //console.log(newMessage)
                  updated['listOfMessages'].push(newMessage)
                }
                var newUpdateMessageData = {
                  sender: req.body.newSender,
                  receiver: req.body.newReceiver,
                  message: req.body.newMessage,
                  year: req.body.newYear,
                  month: req.body.newMonth,
                  day: req.body.newDay,
                  time: req.body.newTime
                }
                var oldListOfMessages = updated['listOfMessages']
                var startIndex = 0
                var endIndex = oldListOfMessages.length
                var indexOfMessage = -1
                // oldListOfMessages.sort(function(d1, d2) {
                //   if (JSON.parse(d1)['time'] > JSON.parse(d2)['time']) {
                //     return 1
                //   } else {
                //     return -1
                //   }
                // })
                // while (True) {
                //   if newMessage['time'] < JSON.parse(oldListOfMessages[(oldListOfMessages.length/2)-1])['time'] {
                //     endIndex = (oldListOfMessages.length/2)-1
                //   } else if newMessage['time'] > JSON.parse(oldListOfMessages[(oldListOfMessages.length/2)-1])['time'] {
                //     startIndex = (oldListOfMessages.length/2)-1
                //   } else {
                //
                //     indexOfMessage = (oldListOfMessages.length/2)-1
                //     break;
                //   }
                // }
                // startIndex = oldListOfMessages.indexOf(JSON.stringify(newMessage))
                // endIndex = oldListOfMessages.indexOf(JSON.stringify(newMessage))
                console.log(JSON.stringify(updateMessageData))
                var indexOfMessage = oldListOfMessages.indexOf(JSON.stringify(updateMessageData))
                if (todo == "updateOldMessage") {
                  db.collection('messages').update(updateMessageData, newUpdateMessageData, (err, newMessageResult) => {

                  })
                  console.log('supjadskfljasdkl;f')
                  updated['listOfMessages'].splice(indexOfMessage, 1)
                  updated['listOfMessages'].push(JSON.stringify(newUpdateMessageData))
                } else if (todo == "deleteUpdatedMessage") {
                  db.collection('messages').deleteOne(updateMessageData)
                  updated['listOfMessages'].splice(indexOfMessage, 1)
                }
                console.log(updated)
                db.collection('scheduled_messages').update(getMessageData, updated, (err, result) => {
                  if (err) {
                    res.send(err)
                  } else {
                    res.send('Updated' + updated)
                  }
                })
              }
            })

        }
    })
}
