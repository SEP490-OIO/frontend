/**
 * ImageGallery — displays a main image with thumbnail strip.
 *
 * Used on the Auction Detail page to show all photos of an item.
 * Click a thumbnail to switch the main image. Click the main image
 * to open Ant Design's built-in preview/zoom overlay.
 *
 * Responsive: full-width on all breakpoints, thumbnails wrap naturally.
 */

import { useState } from 'react';
import { Image, Space, Flex, Typography } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ItemImage } from '@/types';

const { Text } = Typography;

interface ImageGalleryProps {
  images: ItemImage[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const { t } = useTranslation();

  // Sort by sortOrder, primary image first
  const sorted = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = sorted[selectedIndex] ?? sorted[0];

  // Empty state — no images available
  if (sorted.length === 0) {
    return (
      <Flex
        align="center"
        justify="center"
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          background: '#f5f5f5',
          borderRadius: 8,
        }}
      >
        <Flex vertical align="center" gap={8}>
          <PictureOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
          <Text type="secondary">{t('auctionDetail.noImages')}</Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <div>
      {/* Main image — click opens Ant Design preview overlay */}
      <div
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          borderRadius: 8,
          background: '#f5f5f5',
          marginBottom: 12,
        }}
      >
        <Image
          src={mainImage?.imageUrl}
          alt={t('auctionDetail.imageAlt', {
            index: selectedIndex + 1,
            title,
          })}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          preview={{
            src: mainImage?.imageUrl,
          }}
        />
      </div>

      {/* Thumbnail strip — only show if more than 1 image */}
      {sorted.length > 1 && (
        <Space size={8} wrap>
          {sorted.map((img, index) => (
            <div
              key={img.id}
              onClick={() => setSelectedIndex(index)}
              style={{
                width: 72,
                height: 72,
                borderRadius: 6,
                overflow: 'hidden',
                cursor: 'pointer',
                border:
                  index === selectedIndex
                    ? '2px solid #1677ff'
                    : '2px solid transparent',
                opacity: index === selectedIndex ? 1 : 0.7,
                transition: 'all 0.2s',
              }}
            >
              <img
                src={img.imageUrl}
                alt={t('auctionDetail.imageAlt', {
                  index: index + 1,
                  title,
                })}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </Space>
      )}
    </div>
  );
}
