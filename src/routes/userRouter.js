import { Router } from "express";
import passport from 'passport'
import { loginPassport, registerPassport, logout, githubLogin, passResetReq, passReset } from "../controllers/userController.js";

const uRouter = Router()

uRouter.post('/signup', passport.authenticate('register', { failureRedirect: '/failregister' }), registerPassport)

uRouter.post('/login', passport.authenticate('login', { failureRedirect: '/login?login_fail=true' }), loginPassport)

uRouter.get('/logout', logout)

uRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

uRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), githubLogin)

uRouter.post('/passresetreq',passResetReq)

uRouter.post('/passreset/:rid',passReset)

export default uRouter