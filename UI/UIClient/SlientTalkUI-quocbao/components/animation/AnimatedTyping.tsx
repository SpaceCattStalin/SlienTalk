import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { colors } from '@/global/theme';
import LottieView from 'lottie-react-native';

type AnimatedTypingProps = {
    textToType: string[],
    onCompleted?: () => void;
    displayLogo: boolean;
    textStyle?: object;
};

const AnimatedTyping = ({ textToType, onCompleted, displayLogo, textStyle }: AnimatedTypingProps) => {
    let [logoRendered, setLogoRendered] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => setLogoRendered(true), 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    let [typedText, setTypedText] = useState("");
    let [typedTextIndex, setTypedTextIndex] = useState(0);
    let [cursorColor, setCursorColor] = useState("transparent");
    let [textToTypeIndex, setTextToTypeIndex] = useState(0);
    let [timeOuts, setTimeOuts] = useState({
        cursorTimeOut: 0,
        typingTimeOut: 0,
        firstNewLineTimeout: 0,
        secondNewLineTimeout: 0,
    });

    let typedTextRef = useRef(typedText);
    typedTextRef.current = typedText;

    let typedTextIndexRef = useRef(typedTextIndex);
    typedTextIndexRef.current = typedTextIndex;

    let textToTypeIndexRef = useRef(textToTypeIndex);
    textToTypeIndexRef.current = textToTypeIndex;

    let cursorColorRef = useRef(cursorColor);
    cursorColorRef.current = cursorColor;

    let timeOutsRef = useRef(timeOuts);
    timeOutsRef.current = timeOuts;

    let typingAnimation = () => {

        if (typedTextRef.current.length < textToType[textToTypeIndexRef.current].length) {
            setTypedText(typedTextRef.current + textToType[textToTypeIndexRef.current].charAt(typedTextIndexRef.current));
            setTypedTextIndex(typedTextIndexRef.current + 1);

            let updatedTimeOuts = { ...timeOutsRef.current };
            updatedTimeOuts.typingTimeOut = setTimeout(typingAnimation, 50);
            setTimeOuts(updatedTimeOuts);
        } else if (textToTypeIndexRef.current + 1 < textToType.length) {
            setTextToTypeIndex(textToTypeIndexRef.current + 1);
            setTypedTextIndex(0);

            let updatedTimeouts = { ...timeOutsRef.current };
            updatedTimeouts.firstNewLineTimeout = setTimeout(newLineAnimation, 120);
            updatedTimeouts.secondNewLineTimeout = setTimeout(newLineAnimation, 200);
            updatedTimeouts.typingTimeOut = setTimeout(typingAnimation, 280);
            setTimeOuts(updatedTimeouts);
        } else {
            clearInterval(timeOutsRef.current.cursorTimeOut);
            setCursorColor("transparent");

            if (onCompleted) {
                onCompleted();
            }
        }
    };

    let newLineAnimation = () => {
        setTypedText(typedTextRef.current + "\n");
    };

    let cursorAnimation = () => {
        if (cursorColorRef.current === "transparent") {
            setCursorColor(colors.gray400);
        } else {
            setCursorColor("transparent");
        }
    };

    useEffect(() => {
        let updatedTimeouts = { ...timeOutsRef.current };
        updatedTimeouts.typingTimeOut = setTimeout(typingAnimation, 500);
        updatedTimeouts.cursorTimeOut = setInterval(cursorAnimation, 250);
        setTimeOuts(updatedTimeouts);

        return () => {
            clearTimeout(timeOutsRef.current.typingTimeOut);
            clearTimeout(timeOutsRef.current.firstNewLineTimeout);
            clearTimeout(timeOutsRef.current.secondNewLineTimeout);
            clearInterval(timeOutsRef.current.cursorTimeOut);
        };
    }, []);

    return (
        <View style={styles.main}>
            {displayLogo && <LottieView
                source={require('@/assets/lottie/logo.json')}
                autoPlay
                style={{ width: 80, height: 80 }}
                loop={false}
            />}
            <Text style={[styles.text, textStyle]}>
                {typedText}
                {/* <Text style={{ color: cursorColor, fontSize: 35 }}>|</Text> */}
            </Text>
        </View>

    );
};

export default AnimatedTyping;

let styles = StyleSheet.create({
    text: {
        // backgroundColor: 'yellow',
        color: colors.gray300,
        fontWeight: 'bold',
        fontSize: 28,
        alignSelf: 'center'
    },
    main: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6
        // backgroundColor: 'red'
    }
});