from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User  # Import your custom User model

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name', 'role', 'profile_picture')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')  # Remove password2 from the validated data
        user = User.objects.create_user(
            username=validated_data['username'],  # Ensure username is passed
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'member'),  # Default role is 'member'
            profile_picture=validated_data.get('profile_picture', None)
        )
        return user





#from django.contrib.auth.models import User
#from rest_framework import serializers

#class UserSerializer(serializers.ModelSerializer):
    #class Meta:
        #model = User
        #fields = ('id','username','password')
        #extra_kwargs = {'password':{'write_only':True}}

    #def create(self,validated_data):
        #user = User.objects.create_user(**validated_data)
        #return user
    