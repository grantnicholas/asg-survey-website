exports.getData = function(req, res) {
	if (req.session.user) {
		res.render('data', {} );
	}
	else{
		res.redirect('/login');
	}
};

exports.getPDF = function(req, res){
	if (req.session.user) {
		str = './public/data/'+ req.params.dname + '.pdf';
		console.log(str);
		res.sendfile(str,function(err){
			if(err){
				console.log('file does not exist');
				console.log(err);
				res.redirect('/data');
			}
		});
	}
	else{
		res.redirect('/login');
	}
};