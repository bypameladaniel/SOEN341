from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_example(request):
    data = {'message': 'Hello from Django!'}
    return Response(data)

class ReactAppView(TemplateView):
    template_name = 'index.html'  # Ensure this points to your React index.html

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Add any additional context data here
        return context

#def home(request):
    #return HttpResponse("Hello World")