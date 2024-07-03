import React, { useState, useEffect } from 'react';
import './TypingSpeedChecker.css';

// Sentences for the typing test
const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing is a skill that improves with practice.",
    "React is a popular JavaScript library for building user interfaces."
];

const TypingSpeedChecker: React.FC = () => {
    const [sentence, setSentence] = useState<string>(sentences[Math.floor(Math.random() * sentences.length)]);
    const [typedText, setTypedText] = useState<string>('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState<number>(0);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [accuracy, setAccuracy] = useState<number>(100);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (startTime && !isComplete) {
            timer = setInterval(() => {
                setElapsedTime((Date.now() - startTime) / 1000);
            }, 100);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [startTime, isComplete]);

    const handleKeyPress = (event: KeyboardEvent) => {
        if (isComplete) return;

        let newTypedText = typedText;

        if (event.key === "Backspace") {
            newTypedText = newTypedText.slice(0, -1);
        } else if (event.key.length === 1) {
            newTypedText += event.key;
        }

        if (typedText.length === 0 && newTypedText.length === 1) {
            setStartTime(Date.now());
        }

        if (newTypedText.length === sentence.length) {
            const duration = (Date.now() - (startTime || 0)) / 1000 / 60;
            const wordsTyped = calculateWordsTyped(sentence, newTypedText);
            setWpm(Math.round(wordsTyped / duration));
            setIsComplete(true);
        }

        setTypedText(newTypedText);
        setAccuracy(calculateAccuracy(sentence, newTypedText));
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [typedText, startTime, isComplete, sentence]);

    const handleReset = () => {
        setTypedText('');
        setSentence(sentences[Math.floor(Math.random() * sentences.length)]);
        setStartTime(null);
        setWpm(0);
        setIsComplete(false);
        setElapsedTime(0);
        setAccuracy(100);
    };

    const calculateWordsTyped = (sentence: string, typedText: string) => {
        const sentenceWords = sentence.split(' ');
        const typedWords = typedText.split(' ');

        let correctWordsCount = 0;
        for (let i = 0; i < sentenceWords.length; i++) {
            if (typedWords[i] === sentenceWords[i]) {
                correctWordsCount++;
            }
        }

        return correctWordsCount;
    };

    const calculateAccuracy = (sentence: string, typedText: string) => {
        const sentenceWords = sentence.split(' ');
        const typedWords = typedText.split(' ');

        let correctWordsCount = 0;
        for (let i = 0; i < sentenceWords.length; i++) {
            if (typedWords[i] === sentenceWords[i]) {
                correctWordsCount++;
            }
        }

        return Math.round((correctWordsCount / sentenceWords.length) * 100);
    };

    const renderHighlightedText = () => {
        return sentence.split('').map((char, index) => {
            let className = '';
            if (index < typedText.length) {
                // Handle spaces explicitly
                if (char === ' ') {
                    className = typedText[index] === ' ' ? 'correct' : 'incorrect';
                } else {
                    className = char === typedText[index] ? 'correct' : 'incorrect';
                }
            }
            return (
                <span key={index} className={className}>
                    {char === ' ' ? '\u00A0' : char} {/* Replace spaces with non-breaking space */}
                </span>
            );
        });
    };

    return (
        <div className="container">
            <h1>Let's test your typing skills</h1>
            <div>
                <strong>Typing speed (in WPM): {wpm}</strong>
                <strong> | Timer: {elapsedTime.toFixed(1)}s</strong>
                <strong> | Accuracy: {accuracy}%</strong>
            </div>
            <div className="sentence">
                {renderHighlightedText()}
            </div>
            <div className="reset-button-container">
                <button onClick={handleReset} className="reset-button">Reset</button>
            </div>
        </div>
    );
};

export default TypingSpeedChecker;
