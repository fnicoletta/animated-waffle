import { useState, useEffect } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import styles from '../../styles/Post.module.css';

export const Post = ({ title, body, image }) => {
	const [imageUrl, setImageUrl] = useState('');

	useEffect(() => {
		const imageBuilder = imageUrlBuilder({
			projectId: 'd7idjbeo',
			dataset: 'production',
		});

		setImageUrl(imageBuilder.image(image));
	}, [image]);

	return (
		<div>
			<div className={styles.container}>
				<h1>{title}</h1>
				{imageUrl && <img className={styles.mainImage} src={imageUrl} />}
				<div className={styles.body}>
					<BlockContent blocks={body} />
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps = async (context) => {
	const { slug } = context.query;

	if (!slug) {
		return {
			notFound: true,
		};
	}

	const query = encodeURIComponent(
		`*[ _type == "post" && slug.current == "${slug}" ]`
	);
	const url = `https://d7idjbeo.api.sanity.io/v1/data/query/production?query=${query}`;

	const response = await fetch(url);
	const json = await response.json();
	const post = json.result[0];

	if (!post) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			title: post.title,
			body: post.body,
			image: post.mainImage,
		},
	};
};

export default Post;
