import React, { useRef, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const SECTIONS = [
  { title: 'Maytako Menüler', items: ['Menu 1', 'Menu 2', 'Menu 3'] },
  { title: '1 Kişilik Menüler', items: ['Single 1', 'Single 2', 'Single 3'] },
  { title: 'Aile Menüsü', items: ['Family 1', 'Family 2', 'Family 3', 'Family 4'] },
  { title: 'Tatlılar', items: ['Dessert 1', 'Dessert 2'] },
  { title: 'İçecekler', items: ['Drink 1', 'Drink 2', 'Drink 3'] }
];

export default function MenuScreen() {
  const scrollRef = useRef(null);
  const tabsRef = useRef(null);

  const sectionOffsets: any = useRef([]);
  const tabOffsets: any = useRef([]);
  const tabWidths: any = useRef([]);
  const [activeTab, setActiveTab] = useState(0);

  const isScrolling = useRef(false);

  const handlePressTab = (index: number) => {
    const y = sectionOffsets.current[index] ?? 0;
    scrollRef.current?.scrollTo({ y, animated: true });
    scrollTabsTo(index);
    setActiveTab(index);
  };

  const onLayoutSection = (index: number) => (e: any) => {
    sectionOffsets.current[index] = e.nativeEvent.layout.y;
  };

  const onLayoutTab = (index: number) => (e: any) => {
    const { x, width } = e.nativeEvent.layout;
    tabOffsets.current[index] = x;
    tabWidths.current[index] = width;
  };

  const scrollTabsTo = (index: number) => {
    if (!tabsRef.current) return;
    const tabX = tabOffsets.current[index];
    const tabWidth = tabWidths.current[index];
    const scrollToX = tabX - (width / 2 - tabWidth / 2);
    tabsRef.current.scrollTo({ x: Math.max(scrollToX, 0), animated: true });
  };

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const offsets = sectionOffsets.current;
    let current = 0;

    for (let i = 0; i < offsets.length; i++) {
      const start = offsets[i];
      const end = offsets[i + 1] ?? Number.POSITIVE_INFINITY;
      if (y >= start - 60 && y < end - 60) {
        current = i;
        break;
      }
    }

    if (current !== activeTab) {
      setActiveTab(current);
      scrollTabsTo(current);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <ScrollView
        ref={tabsRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {SECTIONS.map((s, i) => (
          <Pressable
            key={i}
            onLayout={onLayoutTab(i)}
            onPress={() => handlePressTab(i)}
            style={[styles.tabItem, activeTab === i && styles.tabItemActive]}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{s.title}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView ref={scrollRef} onScroll={handleScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
        {SECTIONS.map((section, index) => (
          <View key={index} onLayout={onLayoutSection(index)}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, i) => (
              <View key={i} style={styles.card}>
                <Text>{item}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabs: { borderBottomWidth: 1, borderColor: '#eee', position: 'sticky', top: 0 },
  tabItem: { padding: 12 },
  tabItemActive: { borderBottomWidth: 2, borderColor: '#000' },
  tabText: { fontSize: 14, color: '#aaa', fontWeight: '500' },
  tabTextActive: { color: '#000' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginVertical: 12, marginLeft: 12 },
  card: {
    height: 110,
    backgroundColor: '#f6f6f6',
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
