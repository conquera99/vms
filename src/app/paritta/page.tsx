import type { Metadata } from 'next';

import { SITE_URL } from 'utils/constant';

import ParittaPage from './view';
import { TRACKS } from './tracks';

export const metadata: Metadata = {
	title: 'Paritta Suci',
	description:
		'Dengarkan 16 paritta suci — Namakara Gatha, Mangala Sutta, Karaniya Metta Sutta, dan lainnya — dari Vihara Sasana Graha Nunukan. Dapat diputar offline.',
	alternates: {
		canonical: '/paritta',
	},
};

const parittaJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'MusicPlaylist',
	name: 'Paritta Suci',
	url: `${SITE_URL}/paritta`,
	numTracks: TRACKS.length,
	track: {
		'@type': 'ItemList',
		itemListElement: TRACKS.map((track, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: {
				'@type': 'MusicRecording',
				name: track.title,
				url: `${SITE_URL}/paritta`,
				inLanguage: 'pi',
			},
		})),
	},
};

export default function Paritta() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(parittaJsonLd) }}
			/>
			<ParittaPage />
		</>
	);
}
