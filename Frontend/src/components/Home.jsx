import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import Header from './Header';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { Star } from '@mui/icons-material';

const Home = ({ user }) => {
	const { darkMode } = useTheme();
	const [loading, setLoading] = useState(false);
	const [movies, setMovies] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const observer = useRef();

	function formatGrossToDollars(gross) {
		const grossValue = parseFloat(gross.replace(/,/g, ''));
		if (grossValue >= 1000000) {
			const formattedGross = `$${(grossValue / 1000000).toFixed(2)}M`;
			return formattedGross;
		} else {
			const formattedGross = `$${grossValue.toLocaleString()} USD`;
			return formattedGross;
		}
	}


	const welcome = sessionStorage.getItem('welcomeShown');

	useEffect(() => {
		if (!welcome) {
			toast.success(`Welcome, ${user.email}`);
			sessionStorage.setItem('welcomeShown', true);
		}
	}, [user]);

	useEffect(() => {
		fetchData();
	}, []);


	const fetchData = async (pageNumber) => {
		try {
			setLoading(true);
			const res = await axios.get(`http://localhost:4000/posts?page=${pageNumber}`);
			if (pageNumber === 1) {
				setMovies(res.data.data);
			} else {
				setMovies(prevMovies => [...prevMovies, ...res.data.data]);
			}
			setHasMore(res.data.data.length > 0);
			setPage(prevPage => prevPage + 1);
		} catch (error) {
			toast.error('Error fetching movies. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	const memoizedFetchData = useMemo(() => fetchData, []);

	useEffect(() => {
		memoizedFetchData(1);
	}, [memoizedFetchData]);

	useEffect(() => {
		const options = {
			root: null,
			rootMargin: '20px',
			threshold: 1.0
		};

		const handleObserver = (entries) => {
			const target = entries[0];
			if (target.isIntersecting && hasMore) {
				fetchData(page);
			}
		};

		observer.current = new IntersectionObserver(handleObserver, options);
		if (observer && observer.current) {
			observer.current.observe(document.getElementById('observer'));
		}

		return () => {
			if (observer && observer.current) {
				observer.current.disconnect();
			}
		};
	}, [hasMore, page]);

	return (
		<div className={`${darkMode ? 'bg-[#121212]' : 'bg-[#f1f3f4]'} min-h-screen`}>
			<Header />
			<div className='flex justify-center'>
				<div className='lg:mt-20 mt-12 lg:w-8/12 w-11/12'>
					<div data-aos="fade" className={`space-y-2 mt-12 p-4 rounded  ${darkMode ? 'bg-[#1e1e1e] text-white' : 'bg-white'}`}>
						<p className='text-2xl font-semibold'>Top 1000 Films of All Time</p>
						<p>List of top 1000 movies, ranked starting with #1. Rankings are arrived at by combining ratings and percentages from five prominent movie databases: Metacritic, Rotten Tomatoes, IMDb, TCM, and Sight & Sound. Additional points are given to films repeatedly appearing on lists (created by respected critics, film directors, and various publications) of top films.</p>
					</div>
					{
						movies && movies.map((movie, index) => (
							<div data-aos="fade" className={`flex flex-col lg:flex-row items-center lg:items-start mt-7 ${darkMode ? 'bg-[#1e1e1e] text-white' : 'bg-white border'} shadow p-4 lg:pt-4 pt-6 rounded`} key={index}>
								<img className='shadow-black border shadow-md lg:w-40 w-52' src={movie.Poster_Link} alt={movie.Series_Title} />
								<div className='lg:pl-5 mt-6 lg:mt-0'>
									<span className='flex space-x-2 items-center'>
										<p>{index + 1 + "."}</p>
										<p className='font-semibold text-lg'>{movie.Series_Title}</p>
										<p>({movie.Released_Year})</p>
									</span>
									<span className='flex space-x-2 mt-1 ml-1'>
										<p className='text-sm'>{movie.Certificate + " |"}</p>
										<p className='text-sm'>{movie.Runtime + " |"}</p>
										<p className='text-sm'>{movie.Genre}</p>
									</span>
									<div className='mt-3'>
										<span className='flex space-x-5'>
											<p className='flex'><Star className='text-[#E6B91E] mr-1' />{movie.IMDB_Rating}</p>
											{movie.Meta_score && <span className='flex'><p className='bg-green-500 pl-1 pr-1 text-white rounded-sm mr-2'>{movie.Meta_score}</p><p>Metascore</p></span>}
										</span>
										<p className='mt-2'>{movie.Overview}</p>
										<span className='mt-2 lg:flex  items-center'>

											<span className='flex space-x-1 items-center lg:mt-0 mt-2'>
												<p className='text-sm'>{"Director:"}</p>
												<p className='text-sm font-semibold'>{movie.Director}</p>
											</span>
											<span className='flex items-center space-x-1 lg:pl-2'>
												<p className='text-sm mr-1'>{"Stars:"}</p>
												<p className='text-sm font-semibold'>{movie.Star1 + ", " + movie.Star2 + ", " + movie.Star3 + ", " + movie.Star4}</p>
											</span>
										</span>
										<span className='mt-2 flex  items-center'>

											<span className='flex space-x-1 items-center'>
												<p className='text-sm'>{"Votes:"}</p>
												<p className='text-sm'>{movie.No_of_Votes}</p>
											</span>
											{movie.Gross &&
												<span className='flex items-center space-x-1 pl-2'>
													<p>{"|"}</p>
													<p className='text-sm mr-1'>{"Gross:"}</p>
													<p className='text-sm'>{formatGrossToDollars(movie.Gross)}</p>
												</span>
											}
										</span>


									</div>
								</div>

							</div>

						))
					}

					<div id="observer" />


					{
						loading &&

						<div data-aos="fade" className={`flex flex-col lg:flex-row items-center lg:items-start mt-7 ${darkMode ? 'bg-[#1e1e1e] text-white' : 'bg-white border'} shadow p-4 lg:pt-4 pt-6 rounded`}>

							<div className="animate-pulse lg:flex-row flex flex-col items-center w-full space-x-4">
								<div className="lg:h-[14rem] lg:w-[10rem] h-[18rem] w-[13rem] bg-slate-200"></div>
								<div className="flex-1 space-y-7 py-1 w-full lg:mt-0 mt-4">
									<div className="h-2 bg-slate-200 rounded"></div>
									<div className="space-y-4">
										<div className="grid grid-cols-3 gap-4 space-y-1">
											<div className="h-2 bg-slate-200 rounded col-span-2"></div>
											<div className="h-2 bg-slate-200 rounded col-span-1"></div>
										</div>
										<div className="h-2 bg-slate-200 rounded"></div>
									</div>
									<div className="space-y-4">
										<div className="grid grid-cols-3 gap-4 space-y-1">
											<div className="h-2 bg-slate-200 rounded col-span-2"></div>
											<div className="h-2 bg-slate-200 rounded col-span-1"></div>
										</div>
										<div className="h-2 bg-slate-200 rounded"></div>
									</div>
									<div className="space-y-4">
										<div className="grid grid-cols-3 gap-4">
											<div className="h-2 bg-slate-200 rounded col-span-2"></div>
											<div className="h-2 bg-slate-200 rounded col-span-1"></div>

										</div>


									</div>

								</div>
							</div>
						</div>
					}
				</div>
			</div>
			<ToastContainer autoClose={3000} position="bottom-right" />
		</div >
	);
};

export default Home;


