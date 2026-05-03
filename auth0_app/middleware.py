"""
Auth0 Middleware to provide user information to templates and views.
"""


class Auth0Middleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.user_info = None
        if 'user' in request.session:
            request.user_info = request.session['user']

        response = self.get_response(request)
        return response
