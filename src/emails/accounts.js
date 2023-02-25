const mailgun = require('mailgun-js')

const mgApi = process.env.MG_API_KEY

const domain = 'sandboxf893df64acb746889e9d58bef19b8690.mailgun.org'

const mg  = mailgun({apiKey : mgApi, domain : domain})


const welcomeEmail = (email,name) => {
    mg.messages().send({
        from : 'navsingh.iitd@gmail.com',
        to : email,
        subject : 'WElcome to the service',
        text : `Hello ${name}, How are you! Wish you a great day`
    }, (error,body) => {
    console.log(body)
})
}

const departEmail = (email,name) => {
    mg.messages().send({
        from : 'navsingh.iitd@gmail.com',
        to : email,
        subject : 'Sorry to see you go',
        text : `Hi ${name}, Why are you leaving bro?`
    }, (error,body) => {
        console.log(body)
    })
}

module.exports = {welcomeEmail,departEmail}