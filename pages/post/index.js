import { useState, useEffect } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import styles from '../../styles/PostMain.module.css';
import { useRouter } from 'next/router';

export const Post = ({ posts }) => {
	const router = useRouter();
	const [mappedPosts, setMappedPosts] = useState([]);

	useEffect(() => {
		if (!posts.length) {
			return setMappedPosts([]);
		}
		const imageBuilder = imageUrlBuilder({
			projectId: 'd7idjbeo',
			dataset: 'production',
		});
		setMappedPosts(
			posts.map((p) => {
				return {
					...p,
					mainImage: imageBuilder.image(p.mainImage).width(500).height(250),
				};
			})
		);
	}, [posts]);
	return (
		<div>
			<div className={styles.container}>
				<h1>Welcome to my blog</h1>

				<h3>Recent Posts:</h3>

				<div className={styles.feed}>
					{mappedPosts.length ? (
						mappedPosts.map((p, i) => (
							<div
								key={i}
								className={styles.post}
								onClick={() => router.push(`/post/${p.slug.current}`)}>
								<h3>{p.title}</h3>
								<img className={styles.mainImage} src={p.mainImage} />
							</div>
						))
					) : (
						<>No Posts</>
					)}
				</div>
			</div>
		</div>
	);
};

export const getStaticProps = async (context) => {
	const query = encodeURIComponent(`*[ _type == "post" ]`);
	const url = `https://d7idjbeo.api.sanity.io/v1/data/query/production?query=${query}`;

	const response = await fetch(url);
	const json = await response.json();
	const posts = json.result;

	if (!posts || !posts.length) {
		return {
			props: {
				posts: [],
			},
		};
	}
	return {
		props: {
			posts,
		},
		revalidate: 60,
	};
};

export default Post;
