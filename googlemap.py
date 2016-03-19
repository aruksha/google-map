#from google.appengine.api import users

import webapp2
import os
from google.appengine.ext.webapp import template

class MainPage(webapp2.RequestHandler):
	def get(self):
		#self.response.write('Hello world!')
		template_values = {
		}

		path = 'index.html' 
		self.response.out.write(template.render(path, template_values))

app = webapp2.WSGIApplication([
	('/', MainPage),
], debug=True)
