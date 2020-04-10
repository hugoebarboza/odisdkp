import * as app from './app'
import * as email from './http/index'
import * as fcm from './fcm/index'
import * as ntf from './notification/index'

// Function TimeStamp
export const clf = app.dkp

// Function SenEmail
export const httpEmail = email.httpEmail

// Function FCM Send
export const fcmSend = fcm.fcmSend

// Function Notificacion SenMail
export const ntfSend = ntf.notification

