import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Constants from 'expo-constants';


export default function Signup({ navigation }) {
    const [name,setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword,setConfirmPassword] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)

    const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL 

    const handleSignup = async () => {
        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields");
            return;
        }
    
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}/api/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Signup successful! You can now log in.");
                navigation.navigate("Login");  // Redirect to Login page after signup
            } else {
                alert(data.error || "Signup failed. Try again.");
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("Something went wrong. Please try again later.");
        }
    };    

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Image style={styles.icon} source={require('../../assets/images/breakFast.png')} />
            </View>
            <Text style={styles.heading}>Signup for free</Text>
            <Text style={styles.description}>Join us for less than 1 minute, with no cost</Text>
            <View style={styles.inputContainer}>
            <TextInput
                    style={styles.input}
                    placeholder='Full Name'
                    keyboardType='name-phone-pad'
                    autoCapitalize='none'
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    value={email}
                    onChangeText={setEmail}
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder='Password'
                        secureTextEntry={!showPassword}
                        keyboardType='password'
                        autoCapitalize='none'
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={()=>setShowPassword(!showPassword)} style={styles.eyeButton}>
                        <Text>{showPassword ? '👁️' : '🙈'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder='Confirm Password'
                        secureTextEntry={!showConfirmPassword}
                        keyboardType='password'
                        autoCapitalize='none'
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={()=>setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                        <Text>{showConfirmPassword ? '👁️' : '🙈'}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Signup</Text>
                </TouchableOpacity>
                <Text style={styles.signupText}>Already Have an account ? <Text style={styles.toLogin} onPress={() => navigation.navigate('Login')}>Login</Text></Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    heading: {
        textAlign: 'center',
        fontFamily: 'Primary-Bold',
        fontSize: 30,
        marginTop: 10
    },
    iconContainer: {
        height: 80,
        width: 80,
    },
    icon: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 15
    },
    description: {
        fontFamily: 'Primary-Regular',
        fontSize: 16
    },
    inputContainer: {
        width: '100%',
        padding: 20
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: .8,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#fff',
        paddingHorizontal: 15
    },
    button: {
        backgroundColor: 'teal',
        width: '100%',
        padding: 7,
        borderRadius: 8,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'Primary-ExtraBold'
    },
    signupText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14
    },
    toLogin: {
        color: 'blue',
        fontFamily: 'Primary-Bold',
        fontSize: 18
    },
    passwordContainer:{
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        height:50,
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:8,
        paddingHorizontal:15,
        backgroundColor:'#fff',
        marginBottom:15
    },
    passwordInput:{
        flex:1
    },
    eyeButton:{
        padding:10,
    },
})