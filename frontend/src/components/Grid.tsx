import GridTileImage from '@/components/Tile';
import Link from 'next/link';

export function ThreeItemGridItem({
  item,
  size,
  priority
}: {
  item: {
    featuredImage: { url: string };
    title: string;
    priceRange: {
      maxVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    handle: string;
  };
  size: 'full' | 'half';
  priority?: boolean;
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.handle}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.featuredImage.url}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode
          }}
        />
      </Link>
    </div>
  );
}

export default function ThreeItemGrid() {
  const items = [
    {
      image: '/images/1.jpg',
      title: 'Image Label 1',
      price: '10.00',
      currency: 'USD'
    },
    {
      image: '/images/2.jpg',
      title: 'Image Label 2',
      price: '20.00',
      currency: 'USD'
    },
    {
      image: '/images/3.jpg',
      title: 'Image Label 3',
      price: '30.00',
      currency: 'USD'
    }
  ];

  return (
    <section className="mx-auto grid max-w-[1440px] gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItem
        size="full"
        item={{
          featuredImage: { url: items[0].image },
          title: items[0].title,
          priceRange: {
            maxVariantPrice: {
              amount: items[0].price,
              currencyCode: items[0].currency
            }
          },
          handle: 'product-1'
        }}
        priority={true}
      />
      <ThreeItemGridItem
        size="half"
        item={{
          featuredImage: { url: items[1].image },
          title: items[1].title,
          priceRange: {
            maxVariantPrice: {
              amount: items[1].price,
              currencyCode: items[1].currency
            }
          },
          handle: 'product-2'
        }}
        priority={true}
      />
      <ThreeItemGridItem
        size="half"
        item={{
          featuredImage: { url: items[2].image },
          title: items[2].title,
          priceRange: {
            maxVariantPrice: {
              amount: items[2].price,
              currencyCode: items[2].currency
            }
          },
          handle: 'product-3'
        }}
      />
    </section>
  );
}