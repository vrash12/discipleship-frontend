// BibleApp.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import readingPlan from './reading_plan.json'; // Ensure the path is correct
import { useRoute } from '@react-navigation/native';


// Unified Books Array with English and Tagalog Names
const books = [
  // Old Testament Books
  { abbrev: 'gn', name: 'Genesis', nameTagalog: 'Genesis', chapters: 50 },
  { abbrev: 'ex', name: 'Exodus', nameTagalog: 'Exodo', chapters: 40 },
  { abbrev: 'lv', name: 'Leviticus', nameTagalog: 'Levitico', chapters: 27 },
  { abbrev: 'nm', name: 'Numbers', nameTagalog: 'Mga Bilang', chapters: 36 },
  { abbrev: 'dt', name: 'Deuteronomy', nameTagalog: 'Deuteronomio', chapters: 34 },
  { abbrev: 'js', name: 'Joshua', nameTagalog: 'Josue', chapters: 24 },
  { abbrev: 'jd', name: 'Judges', nameTagalog: 'Mga Hukom', chapters: 21 },
  { abbrev: 'rt', name: 'Ruth', nameTagalog: 'Ruth', chapters: 4 },
  { abbrev: '1sa', name: '1 Samuel', nameTagalog: '1 Samuel', chapters: 31 },
  { abbrev: '2sa', name: '2 Samuel', nameTagalog: '2 Samuel', chapters: 24 },
  { abbrev: '1ki', name: '1 Kings', nameTagalog: '1 Hari', chapters: 22 },
  { abbrev: '2ki', name: '2 Kings', nameTagalog: '2 Hari', chapters: 25 },
  { abbrev: '1ch', name: '1 Chronicles', nameTagalog: '1 Cronica', chapters: 29 },
  { abbrev: '2ch', name: '2 Chronicles', nameTagalog: '2 Cronica', chapters: 36 },
  { abbrev: 'ezr', name: 'Ezra', nameTagalog: 'Ezra', chapters: 10 },
  { abbrev: 'ne', name: 'Nehemiah', nameTagalog: 'Nehemias', chapters: 13 },
  { abbrev: 'et', name: 'Esther', nameTagalog: 'Ester', chapters: 10 },
  { abbrev: 'job', name: 'Job', nameTagalog: 'Job', chapters: 42 },
  { abbrev: 'ps', name: 'Psalms', nameTagalog: 'Mga Awit', chapters: 150 },
  { abbrev: 'pr', name: 'Proverbs', nameTagalog: 'Mga Kawikaan', chapters: 31 },
  { abbrev: 'ec', name: 'Ecclesiastes', nameTagalog: 'Eclesiastes', chapters: 12 },
  { abbrev: 'so', name: 'Song of Solomon', nameTagalog: 'Awit ni Solomon', chapters: 8 },
  { abbrev: 'isa', name: 'Isaiah', nameTagalog: 'Isaias', chapters: 66 },
  { abbrev: 'jer', name: 'Jeremiah', nameTagalog: 'Jeremias', chapters: 52 },
  { abbrev: 'lam', name: 'Lamentations', nameTagalog: 'Mga Panaghimagsik', chapters: 5 },
  { abbrev: 'ezek', name: 'Ezekiel', nameTagalog: 'Ezekiel', chapters: 48 },
  { abbrev: 'dan', name: 'Daniel', nameTagalog: 'Daniel', chapters: 12 },
  { abbrev: 'hos', name: 'Hosea', nameTagalog: 'Hosea', chapters: 14 },
  { abbrev: 'joel', name: 'Joel', nameTagalog: 'Joel', chapters: 3 },
  { abbrev: 'amos', name: 'Amos', nameTagalog: 'Amos', chapters: 9 },
  { abbrev: 'obad', name: 'Obadiah', nameTagalog: 'Obadias', chapters: 1 },
  { abbrev: 'jonah', name: 'Jonah', nameTagalog: 'Jonah', chapters: 4 },
  { abbrev: 'mic', name: 'Micah', nameTagalog: 'Mika', chapters: 7 },
  { abbrev: 'nah', name: 'Nahum', nameTagalog: 'Nahum', chapters: 3 },
  { abbrev: 'hab', name: 'Habakkuk', nameTagalog: 'Habakuk', chapters: 3 },
  { abbrev: 'zep', name: 'Zephaniah', nameTagalog: 'Zefanias', chapters: 3 },
  { abbrev: 'hag', name: 'Haggai', nameTagalog: 'Haggai', chapters: 2 },
  { abbrev: 'zec', name: 'Zechariah', nameTagalog: 'Zekarias', chapters: 14 },
  { abbrev: 'mal', name: 'Malachi', nameTagalog: 'Malakias', chapters: 4 },
  
  // New Testament Books
  { abbrev: 'mt', name: 'Matthew', nameTagalog: 'Mateo', chapters: 28 },
  { abbrev: 'mk', name: 'Mark', nameTagalog: 'Marcos', chapters: 16 },
  { abbrev: 'lk', name: 'Luke', nameTagalog: 'Lucas', chapters: 24 },
  { abbrev: 'jn', name: 'John', nameTagalog: 'Juan', chapters: 21 },
  { abbrev: 'act', name: 'Acts', nameTagalog: 'Mga Gawa', chapters: 28 },
  { abbrev: 'rom', name: 'Romans', nameTagalog: 'Mga Romano', chapters: 16 },
  { abbrev: '1co', name: '1 Corinthians', nameTagalog: '1 Corinto', chapters: 16 },
  { abbrev: '2co', name: '2 Corinthians', nameTagalog: '2 Corinto', chapters: 13 },
  { abbrev: 'gal', name: 'Galatians', nameTagalog: 'Mga Galacia', chapters: 6 },
  { abbrev: 'ef', name: 'Ephesians', nameTagalog: 'Mga Efeso', chapters: 6 },
  { abbrev: 'php', name: 'Philippians', nameTagalog: 'Mga Filipos', chapters: 4 },
  { abbrev: 'col', name: 'Colossians', nameTagalog: 'Mga Kolosas', chapters: 4 },
  { abbrev: '1th', name: '1 Thessalonians', nameTagalog: '1 Tesalonica', chapters: 5 },
  { abbrev: '2th', name: '2 Thessalonians', nameTagalog: '2 Tesalonica', chapters: 3 },
  { abbrev: '1ti', name: '1 Timothy', nameTagalog: '1 Timoteo', chapters: 6 },
  { abbrev: '2ti', name: '2 Timothy', nameTagalog: '2 Timoteo', chapters: 4 },
  { abbrev: 'tit', name: 'Titus', nameTagalog: 'Tito', chapters: 3 },
  { abbrev: 'phm', name: 'Philemon', nameTagalog: 'Filemon', chapters: 1 },
  { abbrev: 'heb', name: 'Hebrews', nameTagalog: 'Mga Hebreo', chapters: 13 },
  { abbrev: 'jas', name: 'James', nameTagalog: 'Santiago', chapters: 5 },
  { abbrev: '1pe', name: '1 Peter', nameTagalog: '1 Pedro', chapters: 5 },
  { abbrev: '2pe', name: '2 Peter', nameTagalog: '2 Pedro', chapters: 3 },
  { abbrev: '1jn', name: '1 John', nameTagalog: '1 Juan', chapters: 5 },
  { abbrev: '2jn', name: '2 John', nameTagalog: '2 Juan', chapters: 1 },
  { abbrev: '3jn', name: '3 John', nameTagalog: '3 Juan', chapters: 1 },
  { abbrev: 'jud', name: 'Jude', nameTagalog: 'Judas', chapters: 1 },
  { abbrev: 'rev', name: 'Revelation', nameTagalog: 'Pahayag', chapters: 22 },
];

const bookNameAliases = {
  'psalm': 'Psalms',
  'psalms': 'Psalms', // Include both singular and plural
  // Add other aliases as needed
  'song of songs': 'Song of Solomon',
  'song of solomon': 'Song of Solomon',
  'canticles': 'Song of Solomon',
  '1 john': '1 John',
  'first john': '1 John',
  '2 john': '2 John',
  'second john': '2 John',
  '3 john': '3 John',
  'third john': '3 John',
  // Add more aliases for other books
};

const BibleApp = ({ navigation }) => {
  // State variables
  const [selectedBook, setSelectedBook] = useState(null); // Initialize as null
  const [selectedChapter, setSelectedChapter] = useState(null); // Initialize as null
  const [selectedVersion, setSelectedVersion] = useState('ESV');
  const [commentary, setCommentary] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading=true
  const [loadingCommentary, setLoadingCommentary] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('book');
  const [commentaryVisible, setCommentaryVisible] = useState(false);
  const [bookChapters, setBookChapters] = useState([]);
  const [verses, setVerses] = useState([]); // Verses as an array
  const [highlightedVerses, setHighlightedVerses] = useState([]); // Array of highlighted verse indices
  const [readingPlanVisible, setReadingPlanVisible] = useState(false); // New state for reading plan
  const [selectedMonth, setSelectedMonth] = useState(null); // Selected month for reading plan
  const [searchQuery, setSearchQuery] = useState(''); // State for search functionality
  const [completedDays, setCompletedDays] = useState({}); // State for completed days
  const route = useRoute();
  const scrollViewRef = useRef(null);

  // Storage Key Generators
  const getVersesStorageKey = (book, chapter, version) => `verses_${version}_${book}_${chapter}`;
  const getCommentaryStorageKey = (book, chapter) => `commentary_${book}_${chapter}`;
  const getHighlightedVersesKey = (book, chapter) => `highlightedVerses_${book}_${chapter}`;
  const getLastReadPositionKey = () => `lastReadPosition`;

  // Function to find a book by name (English or Tagalog)
  const findBookByName = (bookName) => {
    const normalizedBookName = bookName.toLowerCase().trim();
  
    // Use alias if available
    const standardBookName = bookNameAliases[normalizedBookName] || bookName;
  
    return books.find(
      (b) =>
        b.name.toLowerCase() === standardBookName.toLowerCase() ||
        b.nameTagalog.toLowerCase() === standardBookName.toLowerCase()
    );
  };
  
  useEffect(() => {
    const initializeApp = async () => {
      if (route.params && route.params.bookName && route.params.chapter) {
        // Use findBookByName function
        const book = findBookByName(route.params.bookName);
  
        if (book) {
          setSelectedBook(book.abbrev);
          setSelectedChapter(route.params.chapter);
          setBookChapters(Array.from({ length: book.chapters }, (_, i) => i + 1));
          if (route.params.verse) {
            setHighlightedVerseNumber(route.params.verse);
          }
        } else {
          Alert.alert('Error', 'Book not found.');
        }
      } else {
        // No parameters passed, proceed as before
        await loadLastReadPosition();
      }
  
      await loadCachedData();
      await loadCompletedDays();
      if (selectedBook && selectedChapter) {
        await fetchVerses(selectedBook, selectedChapter, selectedVersion);
        await loadHighlightedVerses(selectedBook, selectedChapter);
      }
      setLoading(false);
    };
  
    initializeApp();
  
    // Listener to save last read position when navigating away
    const unsubscribe = navigation.addListener('blur', () => {
      if (selectedBook && selectedChapter) {
        saveLastReadPosition(selectedBook, selectedChapter);
      }
    });
  
    return unsubscribe;
  }, [navigation, route.params]);
  

  // Watch for changes in selectedBook, selectedChapter, or selectedVersion
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      fetchVerses(selectedBook, selectedChapter, selectedVersion);
      loadHighlightedVerses(selectedBook, selectedChapter);
    }
  }, [selectedBook, selectedChapter, selectedVersion]);

  // Function to save last read position
  const saveLastReadPosition = async (book, chapter) => {
    try {
      const position = { book, chapter };
      await AsyncStorage.setItem(getLastReadPositionKey(), JSON.stringify(position));
      console.log('Last read position saved:', position);
    } catch (error) {
      console.error('Failed to save last read position:', error);
    }
  };

  // Function to load last read position
  const loadLastReadPosition = async () => {
    try {
      const storedPosition = await AsyncStorage.getItem(getLastReadPositionKey());
      if (storedPosition !== null) {
        const { book, chapter } = JSON.parse(storedPosition);
        setSelectedBook(book);
        setSelectedChapter(chapter);
        const bookData = books.find((b) => b.abbrev === book);
        if (bookData) {
          setBookChapters(Array.from({ length: bookData.chapters }, (_, i) => i + 1));
        }
        console.log('Restored last read position:', book, chapter);
      } else {
        // If no last read position, set default to Genesis 1
        setSelectedBook('gn');
        setSelectedChapter(1);
        const bookData = books.find((b) => b.abbrev === 'gn');
        if (bookData) {
          setBookChapters(Array.from({ length: bookData.chapters }, (_, i) => i + 1));
        }
        console.log('No last read position found. Set to Genesis 1.');
      }
    } catch (error) {
      console.error('Failed to load last read position:', error);
    }
  };

  // Function to load cached verses and commentary
  const loadCachedData = async () => {
    if (!selectedBook || !selectedChapter) return;

    const versesStorageKey = getVersesStorageKey(selectedBook, selectedChapter, selectedVersion);
    const commentaryStorageKey = getCommentaryStorageKey(selectedBook, selectedChapter);

    try {
      const [cachedVerses, cachedCommentary] = await Promise.all([
        AsyncStorage.getItem(versesStorageKey),
        AsyncStorage.getItem(commentaryStorageKey),
      ]);

      if (cachedVerses !== null) {
        setVerses(JSON.parse(cachedVerses));
        console.log('Loaded verses from cache.');
      }

      if (cachedCommentary !== null) {
        setCommentary(JSON.parse(cachedCommentary));
        console.log('Loaded commentary from cache.');
      }
    } catch (error) {
      console.error('Failed to load cached data:', error);
    }
  };

  // Function to load highlighted verses
  const loadHighlightedVerses = async (book, chapter) => {
    if (!book || !chapter) return;

    const key = getHighlightedVersesKey(book, chapter);
    try {
      const storedVerses = await AsyncStorage.getItem(key);
      if (storedVerses !== null) {
        setHighlightedVerses(JSON.parse(storedVerses));
      } else {
        setHighlightedVerses([]);
      }
    } catch (error) {
      console.error('Failed to load highlighted verses:', error);
    }
  };

  // Function to save highlighted verses
  const saveHighlightedVerses = async (book, chapter, verses) => {
    if (!book || !chapter) return;

    const key = getHighlightedVersesKey(book, chapter);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(verses));
      console.log('Highlighted verses saved.');
    } catch (error) {
      console.error('Failed to save highlighted verses:', error);
    }
  };

  // Function to load completed days
  const loadCompletedDays = async () => {
    try {
      const storedCompleted = await AsyncStorage.getItem('completedDays');
      if (storedCompleted !== null) {
        setCompletedDays(JSON.parse(storedCompleted));
      }
    } catch (error) {
      console.error('Failed to load completed days:', error);
    }
  };

  // Function to get available books based on version
  const getAvailableBooks = () => {
    // Assuming versions like 'FSV' and 'MBBTAG' use Tagalog books
    if (selectedVersion === 'FSV' || selectedVersion === 'MBBTAG') {
      return books.filter((b) =>
        ['mt', 'mk', 'lk', 'jn', 'act', 'rom', '1co', '2co', 'gal', 'ef', 'php', 'col', '1th', '2th', '1ti', '2ti', 'tit', 'phm', 'heb', 'jas', '1pe', '2pe', '1jn', '2jn', '3jn', 'jud', 'rev'].includes(b.abbrev)
      );
    }
    // For other versions, return all books (both OT and NT in English)
    return books;
  };

  // Function to fetch verses with caching
  const fetchVerses = async (book, chapter, version) => {
    if (!book || !chapter || !version) return;
  
    setLoading(true);
    const storageKey = getVersesStorageKey(book, chapter, version);
  
    try {
      // Attempt to load verses from AsyncStorage
      const cachedVerses = await AsyncStorage.getItem(storageKey);
      if (cachedVerses !== null) {
        setVerses(JSON.parse(cachedVerses));
        console.log('Loaded verses from cache.');
      } else {
        // Fetch verses from API if not cached
        const response = await fetch(
          `https://backend-disciple-a692164f13b9.herokuapp.com/api/bible/verses?book=${book}&chapter=${chapter}&version=${version}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text(); // Get the response as plain text
        const versesArray = data.split('\n'); // Split the text into an array of verses
  
        setVerses(versesArray);
  
        // Cache the fetched verses
        await AsyncStorage.setItem(storageKey, JSON.stringify(versesArray));
        console.log('Fetched and cached verses from API.');
      }
    } catch (error) {
      console.error('Error fetching verses:', error);
      setVerses(['Failed to load verses.']);
      Alert.alert('Error', 'Failed to load verses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  const fetchCommentary = async (book, chapter) => {
    if (!book || !chapter) return;

    setLoadingCommentary(true);
    const storageKey = getCommentaryStorageKey(book, chapter);

    try {
        // Attempt to load commentary from AsyncStorage
        const cachedCommentary = await AsyncStorage.getItem(storageKey);
        if (cachedCommentary !== null) {
            setCommentary(JSON.parse(cachedCommentary));
            console.log('Loaded commentary from cache.');
        } else {
            // Fetch commentary from API if not cached
            const response = await fetch(
                `https://backend-disciple-a692164f13b9.herokuapp.com/api/commentary?book=${book}&chapter=${chapter}&version=${selectedVersion}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Check if data.commentary exists and is an array
            if (data.commentary && Array.isArray(data.commentary)) {
                setCommentary(data.commentary);

                // Cache the fetched commentary
                await AsyncStorage.setItem(storageKey, JSON.stringify(data.commentary));
                console.log('Fetched and cached commentary from API.');
            } else {
                // Handle cases where commentary is not available
                setCommentary(['No commentary available for this selection.']);
                console.warn(`No commentary data for ${book} chapter ${chapter} version ${selectedVersion}.`);
            }
        }
    } catch (error) {
        console.error('Error fetching commentary:', error);
        setCommentary(['Failed to load commentary.']);
        Alert.alert('Error', 'Failed to load commentary. Please try again later.');
    } finally {
        setLoadingCommentary(false);
    }
};

  // Handler for selecting a chapter
  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setModalVisible(false);
    saveLastReadPosition(selectedBook, chapter);
  };

  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      const previousChapter = selectedChapter - 1;
      setSelectedChapter(previousChapter);
      saveLastReadPosition(selectedBook, previousChapter);
    } else {
      // Move to previous book's last chapter if available
      const currentBookIndex = books.findIndex((b) => b.abbrev === selectedBook);
      if (currentBookIndex > 0) {
        const previousBook = books[currentBookIndex - 1];
        setSelectedBook(previousBook.abbrev);
        setBookChapters(Array.from({ length: previousBook.chapters }, (_, i) => i + 1));
        const previousChapter = previousBook.chapters;
        setSelectedChapter(previousChapter);
        saveLastReadPosition(previousBook.abbrev, previousChapter);
      } else {
        Alert.alert('Info', 'You are at the beginning of the Bible.');
      }
    }
  };
  
  const handleNextChapter = () => {
    const bookData = books.find((b) => b.abbrev === selectedBook);
    if (selectedChapter < bookData.chapters) {
      const nextChapter = selectedChapter + 1;
      setSelectedChapter(nextChapter);
      saveLastReadPosition(selectedBook, nextChapter);
    } else {
      // Move to next book's first chapter if available
      const currentBookIndex = books.findIndex((b) => b.abbrev === selectedBook);
      if (currentBookIndex < books.length - 1) {
        const nextBook = books[currentBookIndex + 1];
        setSelectedBook(nextBook.abbrev);
        setBookChapters(Array.from({ length: nextBook.chapters }, (_, i) => i + 1));
        setSelectedChapter(1);
        saveLastReadPosition(nextBook.abbrev, 1);
      } else {
        Alert.alert('Info', 'You have reached the end of the Bible.');
      }
    }
  };
  

  const handleBookSelect = (book) => {
    setSelectedBook(book.abbrev);
    setSelectedChapter(1); // Reset to chapter 1 when a new book is selected
    setBookChapters(Array.from({ length: book.chapters }, (_, i) => i + 1));
    setModalType('chapter'); // 
  };
  
  // Handler to open modal
  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  // Toggle verse highlighting
  const toggleHighlightVerse = (index) => {
    setHighlightedVerses((prevHighlightedVerses) => {
      const updatedVerses = prevHighlightedVerses.includes(index)
        ? prevHighlightedVerses.filter((i) => i !== index)
        : [...prevHighlightedVerses, index];

      saveHighlightedVerses(selectedBook, selectedChapter, updatedVerses);
      return updatedVerses;
    });
  };

  // Handler for selecting a day from the reading plan
  const handlePlanSelection = (monthName, day) => {
    // Handle OT readings
    day.OT.forEach((ot) => {
      const book = findBookByName(ot.book);

      if (book) {
        setSelectedBook(book.abbrev);
        setSelectedChapter(ot.chapter);
        setBookChapters(Array.from({ length: book.chapters }, (_, i) => i + 1));
        saveLastReadPosition(book.abbrev, ot.chapter);
      } else {
        Alert.alert('Error', `Book "${ot.book}" not found.`);
      }
    });

    // Handle NT readings
    day.NT.forEach((nt) => {
      const book = findBookByName(nt.book);

      if (book) {
        setSelectedBook(book.abbrev);
        setSelectedChapter(nt.chapter);
        setBookChapters(Array.from({ length: book.chapters }, (_, i) => i + 1));
        saveLastReadPosition(book.abbrev, nt.chapter);
      } else {
        Alert.alert('Error', `Book "${nt.book}" not found.`);
      }
    });

    // Mark day as completed
    const updatedCompletedDays = { ...completedDays };
    if (!updatedCompletedDays[monthName]) {
      updatedCompletedDays[monthName] = [];
    }
    if (!updatedCompletedDays[monthName].includes(day.day)) {
      updatedCompletedDays[monthName].push(day.day);
      setCompletedDays(updatedCompletedDays);
      AsyncStorage.setItem('completedDays', JSON.stringify(updatedCompletedDays));
    }
  };

  // Render modal content based on modal type
  const renderModalContent = () => {
    if (modalType === 'book') {
      const availableBooks = getAvailableBooks();
      return (
        <FlatList
          data={availableBooks}
          keyExtractor={(item) => item.abbrev}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleBookSelect(item)}
              style={styles.modalItem}
            >
              <Ionicons
                name="book-outline"
                size={20}
                color="#ff9800"
                style={styles.modalIcon}
              />
              <Text style={styles.modalItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      );
    } else if (modalType === 'chapter') {
      return (
        <FlatList
          data={bookChapters}
          keyExtractor={(item) => `chapter-${item}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleChapterSelect(item)}
              style={styles.modalItem}
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#ff9800"
                style={styles.modalIcon}
              />
              <Text style={styles.modalItemText}>Chapter {item}</Text>
            </TouchableOpacity>
          )}
        />
      );
    } else if (modalType === 'version') {
      const versions = ['ESV', 'MBBTAG', 'FSV', 'CSB', 'NIV'];
      return (
        <FlatList
          data={versions}
          keyExtractor={(item) => `version-${item}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedVersion(item);
                setModalVisible(false);
                // Optionally, refetch verses with the new version
                if (selectedBook && selectedChapter) {
                  fetchVerses(selectedBook, selectedChapter, item);
                }
              }}
              style={styles.modalItem}
            >
              <Ionicons
                name="reader-outline"
                size={20}
                color="#ff9800"
                style={styles.modalIcon}
              />
              <Text style={styles.modalItemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }
  };

  // Render the main component
  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.versionButton} onPress={() => openModal('version')}>
          <Text style={styles.versionText}>{selectedVersion}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navButton} onPress={handlePreviousChapter}>
          <Ionicons name="chevron-back-outline" size={24} color="#333333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openModal('book')}>
          <Text style={styles.navHeaderText}>
            {selectedBook
              ? books.find((b) => b.abbrev === selectedBook)?.name ||
                books.find((b) => b.abbrev === selectedBook)?.nameTagalog
              : 'Loading...'}{' '}
            {selectedChapter ? selectedChapter : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleNextChapter}>
          <Ionicons name="chevron-forward-outline" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.contentArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#ff9800" />
        ) : (
          verses.map((verseContent, index) => (
            <TouchableOpacity key={index} onPress={() => toggleHighlightVerse(index)}>
              <Text
                style={[
                  styles.verseText,
                  highlightedVerses.includes(index) && styles.highlightedVerseText,
                ]}
              >
                {verseContent}
              </Text>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer with Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => openModal('book')}>
          <Ionicons name="book-outline" size={24} color="#ff9800" />
          <Text style={styles.footerButtonText}>Book & Chapter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => {
            if (selectedBook && selectedChapter) {
              fetchCommentary(selectedBook, selectedChapter);
              setCommentaryVisible(true);
            } else {
              Alert.alert('Error', 'Please select a book and chapter first.');
            }
          }}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#ff9800" />
          <Text style={styles.footerButtonText}>Commentary</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.footerButton}
  onPress={() => {
    setReadingPlanVisible(true); // Open the reading plan modal
  }}
>
  <Ionicons name="calendar-outline" size={24} color="#ff9800" />
  <Text style={styles.footerButtonText}>Reading Plan</Text>
</TouchableOpacity>

      </View>

      {/* Commentary Modal */}
      {commentaryVisible && (
        <View style={styles.commentaryContainer}>
          <View style={styles.commentaryHeaderContainer}>
            <Image source={require('../assets/logos/logo.webp')} style={styles.logoImage} />
            <Text style={styles.commentaryHeader}>Commentary</Text>
            <TouchableOpacity onPress={() => setCommentaryVisible(false)} style={styles.closeButton}>
              <Ionicons name="close-circle-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 15 }} nestedScrollEnabled={true}>
            {loadingCommentary ? (
              <ActivityIndicator size="large" color="#ff9800" />
            ) : (
              commentary.map((text, index) => (
                <Text key={index} style={styles.commentaryText}>
                  {text}
                </Text>
              ))
            )}
          </ScrollView>
        </View>
      )}

      {/* Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalOverlay} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                {modalType === 'book'
                  ? 'Select Book'
                  : modalType === 'chapter'
                  ? 'Select Chapter'
                  : 'Select Version'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#ff9800" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalDivider} />
            {renderModalContent()}
          </View>
        </View>
      </Modal>

      {/* Reading Plan Modal */}
      <Modal
        visible={readingPlanVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setReadingPlanVisible(false);
          setSelectedMonth(null);
          setSearchQuery('');
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalOverlay} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                {selectedMonth ? `Select Day - ${selectedMonth.month}` : 'Reading Plan'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setReadingPlanVisible(false);
                  setSelectedMonth(null);
                  setSearchQuery('');
                }}
              >
                <Ionicons name="close-circle-outline" size={24} color="#ff9800" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalDivider} />
            {/* Search Input */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search Month or Day"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
<FlatList
  data={
    selectedMonth
      ? selectedMonth.days.filter((day) => {
          const dayNumberMatches = day.day.toString().includes(searchQuery);
          const psalmMatches = (`Psalm ${day.Psalm.chapter}`).toLowerCase().includes(searchQuery.toLowerCase());
          const otMatches = day.OT.some((ot) =>
            (`${ot.book} ${ot.chapter}`).toLowerCase().includes(searchQuery.toLowerCase())
          );
          const ntMatches = day.NT.some((nt) =>
            (`${nt.book} ${nt.chapter}`).toLowerCase().includes(searchQuery.toLowerCase())
          );
          return dayNumberMatches || psalmMatches || otMatches || ntMatches;
        })
      : readingPlan.filter((month) =>
          month.month.toLowerCase().includes(searchQuery.toLowerCase())
        )
  }
  keyExtractor={(item, index) => {
    if (selectedMonth) {
      return `day-${item.day}`;
    } else if (item.month) {
      return `month-${item.month}-${index}`;
    } else {
      console.warn('Month item missing "month" property:', item);
      return `month-${index}`;
    }
  }}
              renderItem={({ item }) =>
  selectedMonth ? (
    // Render Day Item
    <TouchableOpacity
      onPress={() => {
        handlePlanSelection(selectedMonth.month, item);
        setReadingPlanVisible(false);
        setSelectedMonth(null);
        setSearchQuery('');
      }}
      style={[
        styles.planItem,
        completedDays[selectedMonth?.month]?.includes(item.day) && styles.completedDay,
      ]}
    >
      <Text style={styles.planItemText}>Day {item.day}</Text>

      {/* Display Old Testament Readings */}
      {item.OT && item.OT.length > 0 && (
        <Text style={styles.planItemSubtitle}>
          OT: {item.OT.map((ot) => `${ot.book} ${ot.chapter}`).join(', ')}
        </Text>
      )}

      {/* Display New Testament Readings */}
      {item.NT && item.NT.length > 0 && (
        <Text style={styles.planItemSubtitle}>
          NT: {item.NT.map((nt) => `${nt.book} ${nt.chapter}`).join(', ')}
        </Text>
      )}

      {/* Display Psalm Reading */}
      {item.Psalm && (
        <Text style={styles.planItemSubtitle}>Psalm {item.Psalm.chapter}</Text>
      )}
    </TouchableOpacity>
  ) : (
    // Render Month Item (unchanged)

                  // Render Month Item
                  <TouchableOpacity
                    onPress={() => setSelectedMonth(item)}
                    style={styles.modalItem}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#ff9800"
                      style={styles.modalIcon}
                    />
                    <Text style={styles.modalItemText}>{item.month}</Text>
                  </TouchableOpacity>
                )
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );

};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#ff9800',
    justifyContent:  'center',


  },
  backButton: {
    //put this in the left
    position: 'absolute',
    left: 23,
  },
  headerText: {
    fontSize: 22,
    color: '#ffffff',
    fontFamily: 'Merriweather_700Bold',
    flex: 1,
    textAlign: 'center',
  },
  versionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginLeft: 10,
  },
  versionText: {
    fontSize: 16,
    color: '#ff9800',
    fontFamily: 'Merriweather_400Regular',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 10,
    marginBottom: -120, // Ensure content is not hidden behind foot
  },
  scrollContent: {
    paddingBottom: 100, // Ensure content is not hidden behind footer
  },
  verseText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333333',
    fontFamily: 'Merriweather_400Regular',
    marginBottom: 10,
  },
  highlightedVerseText: {
    backgroundColor: '#ffeb3b',
    color: '#000',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  footerButton: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10, // Adjust spacing as needed
  },
  footerButtonText: {
    fontSize: 12,
    color: '#333333',
    marginTop: 5,
    fontFamily: 'Merriweather_400Regular',
  },
  commentaryContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '70%',
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    zIndex: 1,
  },
  commentaryHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#ff9800',
  },
  commentaryHeader: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: 'Merriweather_700Bold',
  },
  logoImage: {
    width: 97,
    height: 30,
  },
  closeButton: {
    padding: 5,
  },
  commentaryText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 5,
    fontFamily: 'Merriweather_400Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalIcon: {
    marginRight: 10,
  },
  modalItemText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Merriweather_400Regular',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff9800',
    fontFamily: 'Merriweather_700Bold',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  planItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  planItemText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Merriweather_600SemiBold',
  },
  planItemSubtitle: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'Merriweather_400Regular',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  completedDay: {
    backgroundColor: '#c8e6c9',
  },

  navigationBar: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 15,
  paddingVertical: 10,
  backgroundColor: '#f0f0f0',
},
navButton: {
  padding: 5,
},
navHeaderText: {
  fontSize: 20,
  color: '#333333',
  fontFamily: 'Merriweather_700Bold',
  textAlign: 'center',
},

});

export default BibleApp;
