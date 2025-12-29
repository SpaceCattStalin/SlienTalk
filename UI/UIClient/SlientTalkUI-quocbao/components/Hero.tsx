import { Platform, StyleSheet, Text, View, Image } from 'react-native';

import FlameIcon from '@/assets/images/flame1.svg';
import { spacing } from '@/global/theme';
import React from 'react';

type HeroProps = {
    style?: object;
};

const Hero = ({ style }: HeroProps) => {
    return (
        <View style={{ ...style, ...styles.container }}>
            {/* <HeroImage /> */}
            <View style={styles.heroCard}>
                <Text style={styles.heroText}>
                    Xin chào An!
                </Text>
                <View style={styles.imageWrapper}>
                    <Image source={require('@/assets/images/flame.png')} style={styles.flameIcon} />
                </View>
                {/* <View style={{ width: 50, height: 50 }}>
                    <Svg width="100%" height="100%" viewBox="0 0 300 300" >
                        <FlameIcon />
                    </Svg>
                </View> */}
                {/* <FlameIcon width={60} height={60} /> */}

                {/* <Text className='text-4xl font-bold'>Xin chào An!</Text> */}
                {/* <Text className='text-4xl font-bold'>An!</Text> */}
            </View>
        </View>
    );
};

export default Hero;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        ...Platform.select({
            android: {
                elevation: 5
            }
        })
    },
    heroCard: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 12,
        elevation: 10,
        height: 70,
        padding: spacing.md,
        backgroundColor: "#fff",
        overflow: 'hidden'
    },
    imageWrapper: {
        position: "absolute",
        top: -20,
        right: -20
    },
    flameIcon: {
        width: 90,
        height: 90
    },
    heroText: {
        fontSize: 20,
        fontWeight: "semibold"
    }
});;