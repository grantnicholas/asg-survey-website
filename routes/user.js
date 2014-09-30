exports.getLogin = function(req, res) {
	if (req.session.user) {
		return res.redirect('/data');
	}
	res.render('login', {
	title: 'Login',
	success: 0,
	status: "Please login to access the ASG survey data"
	});
};

exports.postLogin = function(req, res) {
	var em = req.body.email;
	var pass = req.body.password;
	var chatroom = req.db.get('collection');
	chatroom.findOne({ email : em}, function(e,doc){
		if(!doc){ 
			res.send("Invalid email: ");
		}
		else {
			if(req.passwordHash.verify(pass, doc.password) ){
				req.session.em = em;
				req.session.user = doc;
				res.redirect('/data');	
			}		
			else{
				res.send("Invalid password: ");
			}
		}
	}); 
};

exports.logout = function(req, res) {
	req.session = null;
	res.redirect('/');
}

exports.getRegister = function(req, res) {
	if (req.session.user) {
		return res.redirect('/data');
	}
	res.render('register', {
		title: 'Create Account'
	});
};

exports.postRegister = function(req, res) {
	if (req.session.user) {
		return res.redirect('/data');
	}

	var pass = req.body.password;
	var em = req.body.email;

	var chatroom = req.db.get('collection');
	chatroom.find({email : em}, {}, function(e,docs){
		if(docs[0]){ 
			res.render('login', {title: 'login', status: 'Email in use: try another email', success: false}); 
		}
		else {
			chatroom.find({email: em }, {}, function(e,docs){
				if(docs[0]){
					res.render('login', {title: 'login', status: 'Email in use: try another email', success: false})
				}			
				else{
					if (em.match(/@u.northwestern.edu/) || em.match(/@northwestern.edu/) ){
						var hashedPassword = req.passwordHash.generate(pass);
						var newuser = newusers = [{ "email" : em, "password" : hashedPassword }];
						chatroom.insert(newuser);

						//send email. Password sent in plaintext = bad bad bad;
						var transporter = req.transporter;
						var mailOptions = {
						    from: 'CIHL Robot ✔ <cihl.robot@gmail.com>', // sender address
						    to: ''+em/*+', grantnicholas2015@u.northwestern.edu'*/, // list of receivers //kevinchen@u.northwestern.edu 
						    subject: 'CIHL Account Registration Complete ', // Subject line
						    text: 'The account:\n '+ em + ' has been created with hashed password:\n '+ hashedPassword +'. ', // plaintext body
						    html: 'The account:\n '+ em + ' has been created with hashed password:\n '+ hashedPassword +'. ' // html body
						};

						transporter.sendMail(mailOptions, function(error, info){
						    if(error){
						        console.log(error);
						    }else{
						        console.log('Message sent: ' + info.response);
						    }
						});

						res.render('login', {title: 'login', status: 'Your account has been successfully created', success: true});
					}
					else{
						res.render('login', {title: 'login', status: 'Must use a northwestern email address: contact asg-analytics@u.northwestern.edu for access', success: false});
					}
				}
			}); 
		}

	});
};
