exports.userSignUpValidator=(req,res,next)=>{req.check('name','name is required ! ').notEmpty();
          req.check('email','email is required ! ')
          .notEmpty()
          .isEmail();
          req.check('password')
          .notEmpty()
          .isLength({min:6 , max:10})
          .withMessage('password must between 6 and 10caractére')
          const  errors=req.ValidationErrors()
          if(errors){
            return res.status(400).json(errors)
          }

             next()
}