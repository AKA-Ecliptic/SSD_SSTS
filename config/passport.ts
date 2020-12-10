import passport from 'passport';
import { Strategy } from 'passport-local';
import { User, UserInstance } from '../models/User';
import bcrypt from 'bcrypt';

passport.use(new Strategy({ usernameField: 'id' },(_id, password, done) =>{
    User.findOne({ where : { _id: _id }}).then(result => {
        if(!result){
            return done(null, false, { message: 'Incorrect credentials'});
        }
        
        let user: UserInstance = result.get();
        bcrypt.compare(password, user.password, (err, res) => {
            if(err) return done(err); 
            if(!res) return done(null, false, { message: 'Incorrect credentials'});
            
            return done(null, user)
        });
        
    }).catch(err => {
        if(err) return done(err);
    });
}));

passport.serializeUser((user: UserInstance, done) => {
    done(null, user._id);
});

passport.deserializeUser((id: string, done) => {
    User.findOne({where: { _id: id }}).then(result => {
        if(!result){
            return done(null, false);
        }

        let user: UserInstance = result.get();
        return done(null, user);

    }).catch(err => {
        if(err) return done(err, false);
    });
});

export default passport;
