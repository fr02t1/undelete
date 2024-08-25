import React, { Component } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { getRemovedThreadIDs } from '../../api/removeddit';
import { getThreads, isThreadDeleted } from '../../api/reddit';
import Post from '../common/Post';
import { connect, GlobalState } from '../../state';

interface SubredditProps extends RouteComponentProps<{ subreddit?: string }> {
  global: GlobalState;
}

interface SubredditState {
  threads: any[];
  loading: boolean;
}

class Subreddit extends Component<SubredditProps, SubredditState> {
  state: SubredditState = {
    threads: [],
    loading: true,
  };

  componentDidMount() {
    const { subreddit = 'all' } = this.props.match.params;
    this.getRemovedThreads(subreddit);
  }

  componentDidUpdate(prevProps: SubredditProps) {
    const { subreddit: newSubreddit = 'all' } = this.props.match.params;
    const { subreddit = 'all' } = prevProps.match.params;

    if (subreddit !== newSubreddit) {
      this.getRemovedThreads(newSubreddit);
    }
  }

  getRemovedThreads(subreddit: string) {
    document.title = `/r/${subreddit}`;
    this.setState({ threads: [], loading: true });
    this.props.global.setLoading('Loading removed threads...');
    getRemovedThreadIDs(subreddit)
      .then(response => {
        const { data } = response;
        const threadIDs = data.map(({ id }: { id: string }) => id);
        return getThreads(threadIDs);
      })
      .then(threads => {
        threads.forEach((thread: any) => {
          thread.removed = isThreadDeleted(thread);
          thread.selftext = '';
          thread.url = thread.permalink;
        });
        this.setState({ threads });
        this.props.global.setSuccess();
      })
      .catch(this.props.global.setError)
      .finally(() => this.setState({ loading: false }));
  }

  render() {
    const { subreddit = 'all' } = this.props.match.params;
    const noThreadsFound = this.state.threads.length === 0 && !this.state.loading;

    return (
      <React.Fragment>
        <div className='subreddit-box'>
          <Link to={`/r/${subreddit}`} className='subreddit-title'>/r/{subreddit}</Link>
          <span className='space' />
          <a href={`https://www.reddit.com/r/${subreddit}`} className='subreddit-title-link'>reddit</a>
          <span className='space' />
          <a href={`https://reveddit.com/r/${subreddit}`} className='subreddit-title-link'>reveddit</a>
        </div>
        {
          noThreadsFound
            ? <p>No removed threads found for /r/{subreddit}</p>
            : this.state.threads.map(thread => (
              <Post key={thread.id} {...thread} />
            ))
        }
      </React.Fragment>
    );
  }
}

export default connect(Subreddit);