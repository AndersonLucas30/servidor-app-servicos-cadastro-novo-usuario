var User = require('../models/user')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')

var functions = {
    addNew: function (req, res) {
        if ( (!req.body.name) || (!req.body.cnpf)   || (!req.body.datanasc)   ||  (!req.body.email)  || (!req.body.password) ) {
            res.json({success: false, msg: 'Preencha todos os campos'})
        }
        else {
            var newUser = User({
                name: req.body.name,
                cnpf: req.body.cnpf, 
                datanasc: req.body.datanasc,
                email: req.body.email,
                 password: req.body.password 
            });
            newUser.save(function (err, newUser) {
                if (err) {
                    res.json({success: false, msg: 'Falha ao salvar'})
                }
                else {
                    res.json({success: true, msg: 'Cadastrado com sucesso'})
                }
            })
        }
    },



    authenticate: function (req, res) {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
                if (err) throw err
                if (!user) {
                    res.status(403).send({success: false, msg: 'Authentication Failed, User not found'})
                }

                else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            var token = jwt.encode(user, config.secret)
                            res.json({success: true, token: token})
                        }
                        else {
                            return res.status(403).send({success: false, msg: 'Authentication failed, wrong password'})
                        }
                    })
                }
        }
        )
    },
    getinfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            return res.json({success: true, msg: 'Hello ' + decodedtoken.name})
        }
        else {
            return res.json({success: false, msg: 'No Headers'})
        }

    }
}

module.exports = functions
