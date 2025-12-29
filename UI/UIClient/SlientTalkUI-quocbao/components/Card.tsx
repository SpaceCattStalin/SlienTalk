import { StyleSheet, Text, View, Image, ImageSourcePropType, Platform, DimensionValue } from 'react-native';
import React, { ReactNode } from 'react';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { spacing } from '@/global/theme';

type CardProps = {
    icon?: ImageSourcePropType;
    iconSize?: { width: number; height: number; };
    promo?: ImageSourcePropType;
    title?: ReactNode;
    content?: ReactNode;
    gradientColors?: string[];
    width: DimensionValue;
    height: DimensionValue;
    justifyContent?: "flex-end" | "flex-start" | "center" | "space-between" | "space-around" | "space-evenly" | undefined;

};

const Card = ({ icon, iconSize, promo, title, content, justifyContent = 'flex-end', gradientColors = ['#ffffff', '#eeeeee'], height, width }: CardProps) => {
    return (
        <View style={{ ...styles.card, width: width, height: height, justifyContent: justifyContent }}>
            {icon && <Svg height="120" width="120" style={styles.svg}>
                <Defs>
                    <RadialGradient id="grad" cx="65%" cy="20%" r="70%">
                        <Stop offset="0%" stopColor={gradientColors[0]} />
                        <Stop offset="100%" stopColor={gradientColors[1]} />
                    </RadialGradient>
                </Defs>
                <Rect x="0" y="0" width="110" height="100" fill="url(#grad)" />
            </Svg>}


            {icon &&
                <View style={styles.imageWrapper}>
                    <Image source={icon} style={{ width: iconSize?.width, height: iconSize?.height }} />
                    {/* <Image source={icon} style={styles.icon} /> */}
                </View>
            }

            {promo &&
                <View style={styles.promoImageWrapper}>
                    <Image source={promo} style={styles.promo} />
                </View>
            }

            <View style={styles.main}>
                {/* <Text style={styles.cardTitle}> */}
                {title}
                {/* </Text>
                <Text style={styles.cardContent}> */}
                {content}
                {/* </Text> */}
            </View>
        </View >
    );
};

export default Card;

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        // elevation: 10,
        padding: spacing.md,
        backgroundColor: "#fff",
        overflow: 'hidden',
        ...Platform.select({
            android: {
                elevation: 10
            }
        })
    },
    svg: {
        position: "absolute",
        top: -25,
        right: -35
    },
    background: {
        flex: 1
    },
    imageWrapper: {
        position: "absolute",
        top: -20,
        right: -20
    },
    icon: {
        width: 70,
        height: 70
    },
    promoImageWrapper: {
        position: "absolute",
        bottom: 0,
        right: 0
    },
    promo: {
        width: 200,
        height: 120,
        resizeMode: 'cover',
    },
    main: {
        display: 'flex',
        gap: 6
    },
    // cardTitle: {
    //     fontSize: 20,
    //     fontWeight: "semibold"
    // },
    // cardContent: {
    //     fontSize: 16,
    //     fontWeight: 'semibold'
    // }
});