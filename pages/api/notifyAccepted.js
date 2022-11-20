const nodemailer = require('nodemailer')
var fs = require('fs')
var handlebars = require('handlebars')
import path from 'path'
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'doctor.on.call.hackathon@gmail.com',
    pass: process.env.GMAIL_PASSWORD,
  },
  secure: true,
})

var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      callback(err)
      throw err
    } else {
      callback(null, html)
    }
  })
}

export default async function handler(req, res) {
  let template = () => {}

  await new Promise((resolve, reject) => {
    readHTMLFile(
      path.join(process.cwd(), '/public/accepted.html'),
      function (err, html) {
        template = handlebars.compile(html)

        const mailOptions = {
          from: 'Doctor On-Call <doctor.on.call.hackathon@gmail.com>',
          to: req.body.patient.email,
          subject: `You have a new request`,
          html: template({}),
        }

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error)
          } else {
            console.log('Email sent: ' + info.response)
          }
          resolve()
        })
      },
    )
  })

  res.status(200).send('success')
}
