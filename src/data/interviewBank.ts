import { Question } from "@/types";

export const CAT_ICO: Record<string, string> = {
  All: "🌐",
  DSA: "🪜",
  "System Design": "🏗️",
  Behavioral: "🧠",
  Technical: "💻",
  Troubleshooting: "🔧",
};

export const CAT_ORDER = ["All", "DSA", "System Design", "Behavioral", "Technical", "Troubleshooting"];

export const BANK: Question[] = [

  // ═══════════════════════════════════════════
  // BLIND 75 — DSA ESSENTIALS
  // ═══════════════════════════════════════════
  {
    cat: "DSA", diff: "Easy", company: "Blind 75",
    q: "Two Sum: Given an array of integers and a target, return indices of two numbers that add up to the target.",
    refAnswer: "Use a HashMap. Iterate once: for each number, calculate complement = target - num. If complement is in map, return its index plus current index. Otherwise, store current num → index in map. Time O(n), Space O(n). Easy: You're looking for a missing puzzle piece — check your 'seen' box before adding a new piece."
  },
  {
    cat: "DSA", diff: "Easy", company: "Blind 75",
    q: "Best Time to Buy and Sell Stock: Find the max profit from a single buy then sell.",
    refAnswer: "One pass: track min_price so far and max_profit. At each price, update min_price = min(min_price, price), then update max_profit = max(max_profit, price - min_price). Time O(n). Easy: Keep buying at the lowest point you've seen so far and see if selling today beats your record."
  },
  {
    cat: "DSA", diff: "Easy", company: "Blind 75",
    q: "Valid Parentheses: Determine if a string of brackets is valid.",
    refAnswer: "Use a Stack. For each char: if it's an opening bracket, push it. If it's a closing bracket, check if the stack's top is the matching opener; if not or stack is empty, return false. At the end, return stack.isEmpty(). Easy: Every open door must be closed in reverse order — a stack enforces that."
  },
  {
    cat: "DSA", diff: "Easy", company: "Blind 75",
    q: "Valid Palindrome: Check if a string is a palindrome, ignoring non-alphanumeric characters.",
    refAnswer: "Two-pointer approach: left starts at 0, right at end. Skip non-alphanumeric characters by moving pointers. Compare lowercased characters. If mismatch, return false. Easy: Fold the cleaned string in half and check if both halves mirror each other."
  },
  {
    cat: "DSA", diff: "Easy", company: "Blind 75",
    q: "Invert Binary Tree.",
    refAnswer: "DFS Recursion: swap left and right children at every node, then recursively call on both children. Base case: node is null. Time O(n). Easy: Hold any given node upside down and swap what's in each hand, then do the same for every child."
  },
  {
    cat: "DSA", diff: "Easy", company: "Blind 75",
    q: "Valid Anagram: Check if two strings are anagrams.",
    refAnswer: "Use a frequency map. Increment for chars in s, decrement for chars in t. If any value ≠ 0 at the end, not an anagram. Alternative: sort both and compare. Time O(n). Easy: Count the letters in both words — anagrams have the exact same letter inventory."
  },
  {
    cat: "DSA", diff: "Easy", company: "Blind 75",
    q: "Binary Search: Search for a target in a sorted array, return its index.",
    refAnswer: "Compare target to mid = (low+high)//2. If target == mid, return mid. If target > mid, search right half (low = mid+1). If target < mid, search left half (high = mid-1). Repeat until found or low > high. Time O(log n). Easy: Like guessing a number 1-100 by always guessing the midpoint."
  },
  {
    cat: "DSA", diff: "Easy", company: "Blind 75",
    q: "Linked List Cycle: Detect if a linked list has a cycle.",
    refAnswer: "Floyd's Cycle Detection (Tortoise & Hare). Use two pointers: slow moves one step, fast moves two steps. If they ever meet, there's a cycle. If fast reaches null, no cycle. Time O(n), Space O(1). Easy: Two runners on a circular track — the fast one will eventually lap the slow one."
  },
  {
    cat: "DSA", diff: "Easy", company: "Blind 75",
    q: "Reverse a Linked List.",
    refAnswer: "Iterative: keep track of prev=null, curr=head. In a loop, store next=curr.next, set curr.next=prev, move prev=curr, curr=next. Return prev. Time O(n), Space O(1). Recursive: reverse rest of list, then make head.next.next = head and head.next = null. Easy: Walk the chain with 3 variables, flipping each arrow as you go."
  },
  {
    cat: "DSA", diff: "Easy", company: "Blind 75",
    q: "Maximum Depth of Binary Tree.",
    refAnswer: "DFS Recursion: return 1 + max(maxDepth(left), maxDepth(right)). Base case: null returns 0. BFS alternative: BFS level by level, count levels. Time O(n). Easy: Ask every node 'how deep does your deepest subtree go?' and take the max."
  },
  {
    cat: "DSA", diff: "Easy", company: "Blind 75",
    q: "Climbing Stairs: How many distinct ways to climb n stairs if you can take 1 or 2 steps at a time?",
    refAnswer: "Classic Fibonacci DP. dp[i] = dp[i-1] + dp[i-2]. Base cases: dp[1]=1, dp[2]=2. Optimize to O(1) space by just tracking previous two values. Time O(n). Easy: The number of ways to reach stair n is the sum of ways to reach n-1 (take one step) and n-2 (take two steps)."
  },
  {
    cat: "DSA", diff: "Easy", company: "Blind 75",
    q: "Contains Duplicate: Return true if an array has any duplicate values.",
    refAnswer: "Add all elements to a HashSet. If you try to add an element that's already there, return true. Otherwise, return false at the end. Time O(n), Space O(n). Easy: Keep a guest list — if someone tries to enter twice, you catch them."
  },
  {
    cat: "DSA", diff: "Medium", company: "Blind 75",
    q: "Maximum Subarray (Kadane's Algorithm): Find the contiguous subarray with the largest sum.",
    refAnswer: "Keep current_sum. At each element: current_sum = max(num, current_sum + num). Update max_sum = max(max_sum, current_sum). The key insight: if current_sum goes negative, restart from the current element. Time O(n), Space O(1). Easy: If adding the next number makes your total worse than just starting fresh, start fresh."
  },
  {
    cat: "DSA", diff: "Medium", company: "Blind 75",
    q: "Longest Substring Without Repeating Characters.",
    refAnswer: "Sliding window with a HashSet. Expand right pointer, adding chars. If char already in set (duplicate), shrink from left until it's removed. Track max window size. Time O(n). Easy: Use two fingers on the string — expand right, but if you hit a duplicate, shrink from the left."
  },
  {
    cat: "DSA", diff: "Medium", company: "Blind 75",
    q: "3Sum: Find all unique triplets in an array that sum to zero.",
    refAnswer: "Sort the array. For each element i (skip duplicates), use two pointers left=i+1, right=end. If sum < 0, move left up. If sum > 0, move right down. If sum == 0, record triplet and skip duplicates on both sides. Time O(n²). Easy: Fix one number, then use two-pointer to find two others that cancel it out."
  },
  {
    cat: "DSA", diff: "Medium", company: "Blind 75",
    q: "Product of Array Except Self: Return an array where each element is the product of all other elements, without division.",
    refAnswer: "Two passes: Left pass — build prefix products where prefix[i] = product of all elements to the left. Right pass — multiply by suffix products from the right in-place. Time O(n), Space O(1) extra. Easy: At each position, multiply everything to the left with everything to the right."
  },
  {
    cat: "DSA", diff: "Medium", company: "Blind 75",
    q: "Coin Change: Find the minimum number of coins to make up a target amount.",
    refAnswer: "Bottom-up DP. dp[i] = min coins to make amount i. For each amount from 1 to target, try each coin: dp[i] = min(dp[i], dp[i - coin] + 1). Init dp[0]=0, rest=infinity. Time O(amount × coins). Easy: Build a table — for each dollar amount, find the cheapest way to make it using previous answers."
  },
  {
    cat: "DSA", diff: "Medium", company: "Blind 75",
    q: "Number of Islands: Count distinct islands in a 2D grid of '1's (land) and '0's (water).",
    refAnswer: "BFS or DFS. Iterate every cell. When you find a '1', increment count and use DFS/BFS to mark all connected '1's as visited (set to '0'). Time O(m×n). Easy: Every time you step on land, flood-fill the whole island so you never count it twice."
  },
  {
    cat: "DSA", diff: "Medium", company: "Blind 75",
    q: "Validate BST: Determine if a binary tree is a valid Binary Search Tree.",
    refAnswer: "Pass down min/max bounds during DFS. Every node must satisfy min < node.val < max. Left child updates max to node.val, right child updates min to node.val. Time O(n). Easy: Every node must be within an allowed range — tighten that range as you go deeper."
  },
  {
    cat: "DSA", diff: "Medium", company: "Blind 75",
    q: "Binary Tree Level Order Traversal (BFS).",
    refAnswer: "Use a queue. Start with root. At each step, know the queue size (= number of nodes at current level). Dequeue each node, record its value, enqueue its children. After all nodes at a level are processed, move to the next. Easy: Process the tree floor by floor, like filling a building from the ground up."
  },
  {
    cat: "DSA", diff: "Medium", company: "Blind 75",
    q: "Clone Graph: Deep clone an undirected graph.",
    refAnswer: "Use BFS or DFS with a HashMap<original, clone>. When visiting a node, create its clone if not yet done. For each neighbor, recursively clone it and add to clone's neighbors. The map prevents infinite loops on cycles. Easy: Process each room once, build a copy of it, and connect the copies the same way."
  },
  {
    cat: "DSA", diff: "Medium", company: "Blind 75",
    q: "Course Schedule: Can you finish all courses given prerequisite pairs? (Detect cycle in directed graph)",
    refAnswer: "Topological Sort via DFS or BFS (Kahn's). Track node states: unvisited, visiting (in DFS stack), visited. If during DFS you revisit a 'visiting' node → cycle exists → impossible. BFS: start with nodes of in-degree 0 (no prereqs), process and remove edges. If all nodes processed, no cycle. Easy: Check if there's a circular dependency."
  },
  {
    cat: "DSA", diff: "Medium", company: "Blind 75",
    q: "Lowest Common Ancestor of a Binary Tree (not BST).",
    refAnswer: "DFS: at each node, check if the node is p or q. Recursively search left and right subtrees. If both sides return non-null, current node is LCA. If only one side returns non-null, bubble that up. Easy: The first node where p and q split into different subtrees is the answer."
  },
  {
    cat: "DSA", diff: "Medium", company: "Blind 75",
    q: "Implement a Trie (Prefix Tree): insert, search, startsWith.",
    refAnswer: "Each TrieNode has children[26] (or HashMap) and isEndOfWord flag. Insert: follow chars, create nodes as needed, mark end. Search: follow chars, return isEndOfWord at last char. StartsWith: follow chars, return true if path exists. Easy: A tree where shared prefixes share branches — like an autocomplete dictionary."
  },
  {
    cat: "DSA", diff: "Hard", company: "Blind 75",
    q: "Merge K Sorted Lists.",
    refAnswer: "Use a Min-Heap (Priority Queue) of size K. Each entry is (value, listIndex, nodeIndex). Extract minimum, add next element from that list. Build result list. Time O(N log K) where N = total nodes. Easy: K lanes merging into one highway — always let the smallest car go first using a priority system."
  },
  {
    cat: "DSA", diff: "Hard", company: "Blind 75",
    q: "Longest Increasing Subsequence (LIS).",
    refAnswer: "DP: dp[i] = LIS ending at index i = 1 + max(dp[j]) for all j < i where nums[j] < nums[i]. O(n²). Optimized: Use patience sort / binary search on a tails array for O(n log n). Easy: Track the smallest ending value of all increasing subsequences of each length."
  },
  {
    cat: "DSA", diff: "Hard", company: "Blind 75",
    q: "Serialize and Deserialize a Binary Tree.",
    refAnswer: "Serialize: BFS or DFS preorder, recording null nodes as '#'. Deserialize: rebuild using a queue of values. For DFS preorder: read first value as root, recursively build left then right subtree. Easy: Flatten the tree into a string, then unflatten it using the same traversal order."
  },
  {
    cat: "DSA", diff: "Hard", company: "Blind 75",
    q: "Find Median from Data Stream.",
    refAnswer: "Two heaps: a Max-Heap for the lower half, a Min-Heap for the upper half. Maintain them balanced (sizes differ by ≤ 1). Adding a number: push to max_heap, then rebalance. Median: if sizes equal, average the two tops; otherwise return top of larger heap. Easy: Keep two sorted halves and the median is always at the boundary."
  },
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "Diameter of Binary Tree: Find the longest path between any two nodes.",
    refAnswer: "For each node, compute height of left and right subtrees. Update max_diameter = max(max_diameter, left_height + right_height). Return 1 + max(left_height, right_height) up the recursion. Time O(n). Easy: The longest bridge goes through a node — it's the sum of the longest arms on each side."
  },
  {
    cat: "DSA", diff: "Easy", company: "LeetCode",
    q: "Middle of the Linked List.",
    refAnswer: "Slow and fast pointers. Slow moves one step, fast moves two. When fast reaches the end, slow is at the middle. Easy: One runner runs twice as fast — when the fast one hits the wall, the slow one is exactly halfway."
  },
  {
    cat: "DSA", diff: "Easy", company: "LeetCode",
    q: "Flood Fill: Given an image grid, fill from (sr, sc) replacing old color with new color.",
    refAnswer: "BFS or DFS from the starting pixel. Replace color. Visit all 4-connected neighbors with the correct original color and recursively fill. Handle edge case: if start color == new color, no-op. Easy: Like the paint bucket tool in MS Paint — spread outward until you hit a different color."
  },
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "Jump Game: Can you reach the last index from index 0, given each element is max jump length?",
    refAnswer: "Greedy: track max_reach. At each index i, if i > max_reach, return false (can't reach here). Otherwise, update max_reach = max(max_reach, i + nums[i]). Easy: Keep updating the furthest point you can reach. If you ever find yourself beyond your reach, you're stuck."
  },
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "Insert Interval: Insert a new interval into a sorted list of non-overlapping intervals.",
    refAnswer: "3 phases: (1) Add all intervals ending before new interval starts. (2) Merge all overlapping intervals by expanding new interval's boundaries. (3) Add the merged interval, then add all remaining intervals. Easy: Walk the list — skip non-overlapping ones on the left, absorb overlapping ones, then copy the rest."
  },
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "K Closest Points to Origin.",
    refAnswer: "Write a custom comparator using distance² = x² + y² (avoid sqrt for efficiency). Use a Max-Heap of size K — maintain the K smallest. Or sort all points by distance. Quickselect gives O(n) average. Easy: Calculate how far each point is from (0,0) and keep the K closest."
  },
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "Implement Min Stack: A stack that supports push, pop, top, and getMin in O(1).",
    refAnswer: "Use two stacks: a main stack and a min_stack. When pushing, push to main. If val ≤ min_stack.top() (or min_stack is empty), also push to min_stack. When popping, if main.top() == min_stack.top(), also pop min_stack. getMin = min_stack.top(). Easy: Keep a shadow stack that tracks the minimum at each state."
  },
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "Evaluate Reverse Polish Notation (e.g., ['2','1','+','3','*'] = 9).",
    refAnswer: "Use a stack. For each token: if it's a number, push it. If it's an operator, pop two numbers, apply the operator, push the result. Final answer is the only element left in the stack. Easy: Process left-to-right; operators grab the last two numbers they see."
  },

  // ═══════════════════════════════════════════
  // SYSTEM DESIGN
  // ═══════════════════════════════════════════
  {
    cat: "System Design", diff: "Medium", company: "Google",
    q: "Design a URL Shortener (like TinyURL).",
    refAnswer: "Key components: (1) API (POST /shorten → return shortURL, GET /short → redirect). (2) Hashing: base62 encode a unique ID (counter-based or random). (3) DB: Map shortCode → originalURL. (4) Cache: Redis for hot links. (5) Scale: consistent hashing for multi-node DB. Easy: A dictionary that maps a short nickname to a long address, with a redirect desk."
  },
  {
    cat: "System Design", diff: "Hard", company: "Meta",
    q: "Design a News Feed system (like Facebook or Twitter).",
    refAnswer: "Two approaches: (1) Pull (fan-out on read): user reads → fetch posts from all followees → merge sort. (2) Push (fan-out on write): when user posts, write to all followers' feeds. Hybrid: push for users < 1M followers, pull for celebrities. Key: cache-heavy, use Redis for feed lists. Easy: Either pre-build everyone's newspaper or build it on demand when they ask."
  },
  {
    cat: "System Design", diff: "Hard", company: "Amazon",
    q: "Design a Distributed Message Queue (like SQS/Kafka).",
    refAnswer: "Components: Producers, Brokers (partitioned logs on disk), Consumer Groups. Kafka uses write-ahead log, partitioned for parallelism. Replication factor for fault tolerance. Consumers track offsets. Delivery semantics: at-most-once, at-least-once, exactly-once. Easy: A conveyor belt that holds messages until workers are ready, with multiple lanes for speed."
  },
  {
    cat: "System Design", diff: "Hard", company: "Google",
    q: "Design a Global Rate Limiter for a distributed API.",
    refAnswer: "Algorithm: Token Bucket (smooth) or Sliding Window Log. Distributed: store counters in Redis with TTL. Use Lua scripts for atomic increment+check. For multi-region: use local counters with eventual consistency, tolerate slight over-limit for edge cases. Easy: Each user gets a bucket of tokens that refills over time — no token, no entry."
  },
  {
    cat: "System Design", diff: "Hard", company: "Amazon",
    q: "Design a Notification System (email, push, SMS at scale).",
    refAnswer: "Decouple with a Message Queue (Kafka). Notification Service reads events, routes to handlers (email/push/SMS). Each handler uses 3rd party (SendGrid, FCM, Twilio). Retry with exponential backoff. Throttle + Dedup. User preferences stored in DB. Easy: A smart postmaster that delivers messages via the best channel and retries when delivery fails."
  },
  {
    cat: "System Design", diff: "Medium", company: "Google",
    q: "Design a Search Autocomplete System.",
    refAnswer: "Trie (prefix tree) for fast prefix lookups. Store top-K suggestions per prefix node. Offline: aggregate search logs, compute top queries per prefix, update Trie. Cache popular prefixes in memory. Approximate with distributed shared Trie. Easy: A smart dictionary that figures out the most popular words starting with whatever you've typed."
  },
  {
    cat: "System Design", diff: "Hard", company: "Netflix",
    q: "Design a Video Streaming Platform (like YouTube or Netflix).",
    refAnswer: "Uploads: chunked upload → transcoding service (multiple resolutions) → CDN. Metadata DB (SQL). Viewing: client requests → CDN-served HLS/DASH segments. Adaptive bitrate: client switches quality based on bandwidth. CDN edge nodes globally. Easy: Cut videos into small, pre-sized chunks that the nearest internet station delivers to you."
  },
  {
    cat: "System Design", diff: "Hard", company: "Uber",
    q: "Design a Ride-Sharing App (like Uber/Lyft).",
    refAnswer: "Core: Location Service (WebSocket for real-time driver location updates → Redis geospatial index). Matching Service (find nearest available drivers). Trip Service (stateful, manages trip lifecycle). Surge Pricing (demand/supply ratio). Easy: A real-time map of drivers stored in a geospatial database, matched to riders by distance."
  },
  {
    cat: "System Design", diff: "Medium", company: "Amazon",
    q: "Design a Distributed Cache (like Redis or Memcached).",
    refAnswer: "Key design: Consistent Hashing for node distribution (minimizes remapping on scale). Eviction: LRU (Least Recently Used) or LFU. Cache-aside pattern: app checks cache first, if miss → read from DB and populate cache. Replication for read performance. Easy: A fast-access sticky note board that forgets old notes when it fills up."
  },
  {
    cat: "System Design", diff: "Hard", company: "Goldman Sachs",
    q: "Design a Real-Time Stock Trading Platform.",
    refAnswer: "Order Book: in-memory sorted map (price → orders). Matching Engine: for each new order, try to match against opposite side of book. Use Lock-free data structures (Disruptor). Market data feed: publish trades via WebSocket. Risk checks before order placement. Persistence: async write to DB after matching. Easy: An ultra-fast auctioneer matching buyers and sellers in microseconds."
  },
  {
    cat: "System Design", diff: "Medium", company: "Generic",
    q: "Design a Web Crawler.",
    refAnswer: "Seed URLs → URL Frontier (priority queue, dedup via Bloom Filter). Fetcher (respect robots.txt, rate limit per domain). Parser (extract links, content). Content Storage (dedup by hash). Scheduler. Scale: distributed, multiple crawlers in parallel. Easy: A robot that visits web pages, reads them, and follows every link it finds — carefully avoiding infinite loops."
  },

  // ═══════════════════════════════════════════
  // GOOGLE — BEHAVIORAL
  // ═══════════════════════════════════════════
  {
    cat: "Behavioral", diff: "Medium", company: "Google",
    q: "Tell me about a time you had a conflict with a teammate.",
    refAnswer: "STAR: Describe a technical or priority disagreement. Show you listened first, then used data to frame the discussion (e.g., performance benchmarks). Propose a compromise or experiment. Emphasize outcome: resolved professionally, improved process, maintained relationship. Key: Google values 'constructive debate' and psychological safety."
  },
  {
    cat: "Behavioral", diff: "Medium", company: "Google",
    q: "Describe a time you worked on a project with significant ambiguity.",
    refAnswer: "STAR: Explain how you broke ambiguity down — defined success metrics first, then identified the minimal experiment to test assumptions. Show stakeholder alignment. Key trait: Google values 'structured thinking under uncertainty'. Tip: mention OKRs or data-driven decision checkpoints."
  },
  {
    cat: "Behavioral", diff: "Hard", company: "Google",
    q: "Tell me about a time you had to influence a decision without having direct authority.",
    refAnswer: "STAR: Show coalition building — you identified stakeholders, understood their incentives, and framed your proposal in terms of their goals. Use data/prototypes to reduce risk perception. Key: Google values 'emergent leadership'. Tip: mention a cross-functional influence story where your idea was adopted."
  },
  {
    cat: "Behavioral", diff: "Easy", company: "Google",
    q: "Why Google? What excites you about this role specifically?",
    refAnswer: "Focus on scale and impact ('billions of users'), Google's unique infrastructure (Spanner, BigQuery), open source contributions, and research culture. Be specific to the team (e.g., if Ads: 'the ML challenge of real-time bidding at 10M queries/sec'). Easy: Show you've done homework on their specific tech, not just the brand."
  },
  {
    cat: "Behavioral", diff: "Medium", company: "Google",
    q: "Tell me about a time you made a mistake in production and how you handled it.",
    refAnswer: "STAR: Be honest — own the mistake fully. Show rapid incident response (diagnosis, mitigation, communication). Most importantly: describe the post-mortem process, the root cause, and the systemic fix you shipped (monitoring, test, process change). Key: Google has a 'blameless culture' — they want to see the fix, not the excuse."
  },

  // ═══════════════════════════════════════════
  // AMAZON — BEHAVIORAL (Leadership Principles)
  // ═══════════════════════════════════════════
  {
    cat: "Behavioral", diff: "Hard", company: "Amazon",
    q: "Tell me about a time you failed. What did you learn? (LP: Ownership)",
    refAnswer: "Amazon wants full ownership — no blaming, excuses, or 'we'. State what YOU did wrong. Explain the business impact. Describe root cause analysis (5 Whys). Show the systemic fix you implemented. Key: The 'learning' must be concrete — a process, a test, a monitoring alert you added. Easy: Own it completely and show you fixed the system, not just the symptom."
  },
  {
    cat: "Behavioral", diff: "Hard", company: "Amazon",
    q: "Tell me about a time you delivered a project under extreme time or resource constraints. (LP: Deliver Results)",
    refAnswer: "STAR with heavy focus on trade-off decision-making. What did you cut? Why? How did you unblock bottlenecks? Show prioritization framework (must-have vs nice-to-have). Quantify the result. Key: Amazon wants evidence of 'high bar' even under pressure — no 'good enough' shortcuts without deliberate justification."
  },
  {
    cat: "Behavioral", diff: "Medium", company: "Amazon",
    q: "Describe a time you disagreed with your manager and what happened. (LP: Have Backbone, Disagree and Commit)",
    refAnswer: "Show that you voiced your concern clearly with data. Describe respectful pushback. If overruled, show you committed fully to the decision once made. Key: Amazon specifically values the ability to disagree professionally but then execute without undermining the decision. Easy: You didn't stay quiet, argued your point, and then committed when the call was made."
  },
  {
    cat: "Behavioral", diff: "Medium", company: "Amazon",
    q: "Tell me about a time you went above and beyond for a customer. (LP: Customer Obsession)",
    refAnswer: "STAR: The customer can be internal or external. Show that you identified a pain point they didn't even articulate, proactively solved it, and followed up. Key: Amazon wants 'working backwards from the customer' — your decision must have been driven by customer impact, not convenience. Include a metric if possible ('reduced support tickets by 40%')."
  },

  // ═══════════════════════════════════════════
  // META — BEHAVIORAL
  // ═══════════════════════════════════════════
  {
    cat: "Behavioral", diff: "Hard", company: "Meta",
    q: "Tell me about a time you had to make a decision with incomplete data.",
    refAnswer: "STAR: Show how you structured the decision under uncertainty — what assumptions you made explicit, what the minimum viable data was, and how you built in a review point to course-correct. Key: Meta values 'move fast' but also learning from experiments. Tip: Frame it as a calculated bet, not a guess."
  },
  {
    cat: "Behavioral", diff: "Medium", company: "Meta",
    q: "Describe a time you prioritized long-term correctness over short-term speed.",
    refAnswer: "Give an example where you identified technical debt that would compound. Show how you quantified the future cost vs short-term cost of 'doing it right'. Key: Meta values impact — connect the long-term choice to a concrete improvement in reliability, velocity, or user trust. Easy: Know when to slow down to speed up."
  },
  {
    cat: "Behavioral", diff: "Easy", company: "Meta",
    q: "Why Meta? What about the scale and mission excites you?",
    refAnswer: "Reference 'connecting 3B+ people', AR/VR future (metaverse), WhatsApp/Instagram ecosystem integration. Be specific to the role — ML? Mention PyTorch's open source influence. Infrastructure? Mention TAO (social graph DB). Easy: Talk about the problems that only exist at Meta's scale and why that's exciting to solve."
  },

  // ═══════════════════════════════════════════
  // JP MORGAN — BEHAVIORAL & TECHNICAL
  // ═══════════════════════════════════════════
  {
    cat: "Behavioral", diff: "Easy", company: "JP Morgan",
    q: "Why JP Morgan? What interests you about our Corporate & Investment Bank (CIB)?",
    refAnswer: "Reference scale ($12B+ annual tech budget), transformation to cloud/ML, specific initiatives like the LOXM AI trading engine or Onyx blockchain platform. Show understanding of fintech regulation (Basel III, MiFID II). Easy: You want impact at the intersection of finance and cutting-edge technology with institutional trust."
  },
  {
    cat: "Technical", diff: "Medium", company: "JP Morgan",
    q: "Explain ACID properties of a database transaction.",
    refAnswer: "Atomicity: all-or-nothing (a bank transfer either fully completes or fully rolls back). Consistency: DB moves from one valid state to another (can't overdraw below $0 if constrained). Isolation: concurrent transactions don't see each other's intermediate states. Durability: committed data survives power failure. Easy: It's the 4-point guarantee that your financial transaction won't get corrupted."
  },
  {
    cat: "Technical", diff: "Hard", company: "JP Morgan",
    q: "What is the CAP Theorem and how does it apply to financial systems?",
    refAnswer: "CAP: Consistency (every read gets the latest write), Availability (every request gets a response), Partition Tolerance (system works despite network splits). Can only guarantee 2 of 3. Finance typically chooses CP (Consistency + Partition Tolerance) — e.g., you cannot show a client a stale balance. Sacrifice availability under partition (show an error) rather than risk inconsistency. Easy: In a network split, financial systems choose 'correct data or nothing' over 'possibly wrong data quickly'."
  },
  {
    cat: "Technical", diff: "Medium", company: "JP Morgan",
    q: "What is the difference between a mutex and a semaphore?",
    refAnswer: "Mutex (Mutual Exclusion): Binary lock owned by one thread. Only the owner can release it. Used to protect a single critical section. Semaphore: Counter-based. Can allow N threads concurrently. Not owned (any thread can signal). Used for resource pools (e.g., max 10 DB connections). Easy: Mutex is a key to one bathroom. Semaphore is a counter for a parking lot."
  },

  // ═══════════════════════════════════════════
  // GOLDMAN SACHS — TECHNICAL & BEHAVIORAL
  // ═══════════════════════════════════════════
  {
    cat: "Technical", diff: "Medium", company: "Goldman Sachs",
    q: "Explain the 'Two-Sum' problem using a Hash Map for O(n) complexity.",
    refAnswer: "Iterate once. For each number, compute complement = target - num. Check if complement exists in HashMap — if yes, return both indices. If no, store num → index in HashMap. O(n) time, O(n) space. Easy: Keep a 'seen' ledger and check if the missing partner of the current number has already been seen."
  },
  {
    cat: "Technical", diff: "Hard", company: "Goldman Sachs",
    q: "How do you handle High-Frequency Trading (HFT) data spikes in a Java-based order system?",
    refAnswer: "Use LMAX Disruptor (lock-free ring buffer) instead of synchronized queues. Minimize GC: use primitive collections, object pooling, and off-heap memory (ByteBuffers). Pre-allocate. Busy-spin instead of blocking. Pin threads to CPU cores (thread affinity). Use UDP multicast for market data. Easy: Remove every lock and garbage-collection pause from the hot path — every microsecond counts."
  },
  {
    cat: "Technical", diff: "Easy", company: "Goldman Sachs",
    q: "What is the difference between SQL INNER JOIN, LEFT OUTER JOIN, and FULL OUTER JOIN?",
    refAnswer: "INNER JOIN: only rows with matching keys in both tables. LEFT OUTER JOIN: all rows from left + matching from right (nulls for non-matches on right). FULL OUTER JOIN: all rows from both tables (nulls on both sides for non-matches). Easy: Inner = mutual friends. Left = all of my friends + any mutual ones. Full = everyone from both friend lists."
  },
  {
    cat: "Behavioral", diff: "Hard", company: "Goldman Sachs",
    q: "Tell me about a time you identified a significant risk that others had missed.",
    refAnswer: "STAR: Show analytical depth — you noticed an edge case, a compliance gap, or a systemic fragility. Explain how you escalated it with evidence, modeled the potential impact, and proposed a mitigation. Key: GS values 'risk intelligence' — especially in markets and engineering. Include a quantified consequence ('..which would have exposed us to $2M in settlement risk')."
  },

  // ═══════════════════════════════════════════
  // MORGAN STANLEY — TECHNICAL
  // ═══════════════════════════════════════════
  {
    cat: "Technical", diff: "Medium", company: "Morgan Stanley",
    q: "What is Dependency Injection and why is it used?",
    refAnswer: "DI: a class receives its dependencies from external code rather than creating them internally. Benefits: testability (inject mocks), flexibility (swap implementations), separation of concerns. Frameworks: Spring (Java), .NET Core, Angular. Easy: Instead of a car building its own engine, a factory provides the engine — so you can easily swap in different engine types."
  },
  {
    cat: "Technical", diff: "Hard", company: "Morgan Stanley",
    q: "Explain the difference between TCP and UDP and when you'd choose each.",
    refAnswer: "TCP: connection-oriented, guaranteed delivery, ordered, flow-controlled. Use for: APIs, file transfers, DB connections, anything requiring reliability. UDP: connectionless, no guarantee, faster, lower overhead. Use for: video streaming, DNS queries, gaming, financial market data (latency > reliability). Easy: TCP is certified mail. UDP is shouting across the room — faster, but you might not be heard."
  },
  {
    cat: "Technical", diff: "Medium", company: "Morgan Stanley",
    q: "What is Index in a database, and what are the trade-offs?",
    refAnswer: "An index is a data structure (usually B-Tree or Hash) that allows faster lookups by non-primary-key columns. Trade-offs: Faster reads (avoid full table scans), but slower writes (index must be updated on INSERT/UPDATE/DELETE) and extra storage. Over-indexing hurts write-heavy workloads. Use EXPLAIN/ANALYZE to verify index usage. Easy: Like a book's table of contents — find chapters fast, but updating the book means updating the index too."
  },

  // ═══════════════════════════════════════════
  // APPLE — TECHNICAL
  // ═══════════════════════════════════════════
  {
    cat: "Technical", diff: "Hard", company: "Apple",
    q: "Explain Swift's ARC (Automatic Reference Counting) and how to prevent Strong Reference Cycles.",
    refAnswer: "ARC tracks object retention with a reference count. Object deallocs when count hits 0. Strong Reference Cycle: A holds B, B holds A → neither ever deallocs → memory leak. Fix: use 'weak' (optional, zeroed when object deallocs) or 'unowned' (non-optional, crashes if object gone) in one side of the relationship. Capture lists in closures: [weak self]. Easy: ARC is a popularity counter — 'weak' friends don't count toward keeping you alive."
  },
  {
    cat: "Technical", diff: "Medium", company: "Apple",
    q: "What is the difference between value types and reference types in Swift?",
    refAnswer: "Value Types (Struct, Enum, Tuple): each variable holds its own copy. Mutating a copy doesn't affect the original. Reference Types (Class): variables hold a reference (pointer) to shared memory. Mutating it affects all references. Swift structs use Copy-on-Write for efficiency. Easy: Value type = photocopying a document. Reference type = sharing a Google Doc live."
  },

  // ═══════════════════════════════════════════
  // NETFLIX — BEHAVIORAL & TECHNICAL
  // ═══════════════════════════════════════════
  {
    cat: "Behavioral", diff: "Medium", company: "Netflix",
    q: "Netflix has a 'Freedom and Responsibility' culture. Give an example that demonstrates this value.",
    refAnswer: "STAR: Describe a situation where you operated with high autonomy — you made a significant technical/product decision without waiting for permission. Show you documented the decision, weighed the risk, and owned the outcome. Key: Netflix wants senior, self-directed engineers. Easy: Show you act like an owner, not a permission-seeker."
  },
  {
    cat: "Technical", diff: "Hard", company: "Netflix",
    q: "How does Netflix use Chaos Engineering (Chaos Monkey) to improve resilience?",
    refAnswer: "Chaos Engineering: deliberately inject failures in production to discover weaknesses before customers do. Chaos Monkey randomly terminates EC2 instances. Simian Army: Latency Monkey (adds delays), Chaos Gorilla (kills AZ), etc. Learnings: forces teams to build for failure, use circuit breakers (Hystrix), implement fallbacks. Easy: Break things on purpose in a controlled way so you build systems strong enough to handle real breaks."
  },

  // ═══════════════════════════════════════════
  // MICROSOFT — TECHNICAL & BEHAVIORAL
  // ═══════════════════════════════════════════
  {
    cat: "Technical", diff: "Medium", company: "Microsoft",
    q: "Explain the difference between Process and Thread.",
    refAnswer: "Process: independent program with its own memory space, heap, open files, and OS resources. Thread: a unit of execution within a process sharing the same memory. Context switch between processes is expensive; between threads is cheap. Race conditions arise when threads share state unsafely. Easy: A process is a restaurant; threads are waiters inside sharing the same kitchen (memory)."
  },
  {
    cat: "Technical", diff: "Hard", company: "Microsoft",
    q: "What is a deadlock and how do you prevent it?",
    refAnswer: "Deadlock: two or more threads wait on each other's locks indefinitely. Conditions (Coffman): Mutual Exclusion, Hold-and-Wait, No Preemption, Circular Wait. Prevention: Impose a lock ordering (always acquire lock A before B), use try-lock with timeout, use lock-free algorithms, or use a single global lock. Easy: Thread 1 has key A and waits for B; Thread 2 has key B and waits for A — neither can proceed."
  },
  {
    cat: "Behavioral", diff: "Medium", company: "Microsoft",
    q: "Describe a time you drove a culture of 'growth mindset' in your team.",
    refAnswer: "STAR: Reference Microsoft's core value. Show you normalized failure/learning (e.g., blameless postmortems). Describe concrete rituals: retrospectives, 'learning lunches', documenting failed experiments. Key: Microsoft's Satya Nadella era emphasizes 'learn-it-all vs know-it-all'. Easy: Show how you created space for people to try, fail, and grow without fear."
  },

  // ═══════════════════════════════════════════
  // CITADEL / JANE STREET — QUANTITATIVE
  // ═══════════════════════════════════════════
  {
    cat: "Technical", diff: "Hard", company: "Citadel",
    q: "What is the time complexity of QuickSort in best, average, and worst case?",
    refAnswer: "Best/Average: O(n log n) — with a good pivot, partition splits array roughly in half. Worst: O(n²) — pivot is always the min or max (already sorted array with naive pivot). Fix: random pivot, median-of-3. In-place and cache-friendly. Easy: With a lucky pivot it's like efficient binary splitting; with a terrible pivot it degrades into bubble sort."
  },
  {
    cat: "Technical", diff: "Hard", company: "Citadel",
    q: "Explain what a Hash Map collision is and how chaining vs open addressing resolve it.",
    refAnswer: "Collision: two keys hash to the same bucket. Chaining: each bucket is a linked list; append on collision (unbounded growth, cache-unfriendly). Open Addressing: find next open slot (linear probing, quadratic, double hashing) — cache-friendly, but degrades at high load factor. HashMap load factor ~0.75 is standard for rebalancing. Easy: Chaining adds a list at a crowded locker; open addressing finds the next free locker."
  },
  {
    cat: "DSA", diff: "Hard", company: "Jane Street",
    q: "Given an array, find the contiguous subarray of length k with the maximum sum.",
    refAnswer: "Sliding Window in O(n). Compute sum of first k elements. Then slide the window: add the next element, remove the leftmost. Track max. Space O(1). Easy: Imagine a k-wide frame sliding along the array — you just update the running total by adding one side and removing the other."
  },

  // ═══════════════════════════════════════════
  // TECHNICAL — GENERAL
  // ═══════════════════════════════════════════
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "What is REST vs GraphQL? When would you choose each?",
    refAnswer: "REST: resource-based URLs, over-fetching or under-fetching. Simple, cacheable. Best for: simple CRUD, public APIs. GraphQL: client specifies exactly what data it needs in one query, avoiding over-fetch. Best for: complex frontends with varied data needs, mobile (minimize bandwidth). Trade-off: GraphQL has tooling overhead and caching is harder. Easy: REST is a fixed menu; GraphQL is ordering exactly what you want."
  },
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "Explain the difference between SQL and NoSQL databases. When would you use each?",
    refAnswer: "SQL (Relational): structured schema, ACID, JOIN operations, ideal for complex queries and relationships. NoSQL: schema-less or flexible schema, horizontal scale, eventual consistency. Types: Document (MongoDB), Key-Value (Redis), Column (Cassandra), Graph (Neo4j). Use SQL for financial/accounting data; NoSQL for user profiles, product catalogs, real-time feeds. Easy: SQL is a meticulously organized filing cabinet. NoSQL is a flexible collection of boxes that scale sideways."
  },
  {
    cat: "Technical", diff: "Hard", company: "Generic",
    q: "What happens when you type 'google.com' in your browser?",
    refAnswer: "Full stack question: (1) DNS lookup (cache → resolver → TLD → authoritative DNS → IP). (2) TCP handshake. (3) TLS handshake (certificate verification, symmetric key exchange). (4) HTTP GET request. (5) Server processes, sends HTTP response. (6) Browser parses HTML/CSS/JS, renders critical path, executes JS, loads subresources. Easy: Your browser looks up the address, shakes hands securely, asks for the page, and paints what it receives."
  },
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "What is a microservices architecture and what are its trade-offs?",
    refAnswer: "Microservices: decompose application into small, independent services with their own DB. Benefits: independent deployment, technology diversity, fault isolation, team autonomy. Downsides: network latency between services, distributed system complexity (sagas, two-phase commit), operational overhead (service mesh, observability). Easy: Instead of one giant app, build small specialist teams — but they need a lot of coordination infrastructure."
  },
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "What is Docker and Kubernetes, and what problem does each solve?",
    refAnswer: "Docker: packages an application with all its dependencies into a portable container image. Solves 'works on my machine'. Kubernetes (K8s): orchestrates containers across a cluster — handles scheduling, scaling, load balancing, rolling updates, self-healing. Think of Docker as shipping containers; K8s as the shipping port logistics system. Easy: Docker = standardized box. K8s = the warehouse that manages thousands of those boxes."
  },
  {
    cat: "Technical", diff: "Hard", company: "Generic",
    q: "Explain Event-Driven Architecture and how it differs from request-response.",
    refAnswer: "Request-Response: caller waits synchronously for a response. Event-Driven: producer emits events to a broker (Kafka, SQS); multiple consumers process independently. Benefits: decoupling, elasticity, audit log. Challenges: eventual consistency, event ordering, idempotency (consumer must handle duplicate events safely). Easy: Instead of calling someone and waiting, you leave a note — they'll pick it up and act when ready."
  },
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "What is a Load Balancer and what are the strategies it uses?",
    refAnswer: "Load Balancer distributes incoming traffic across multiple servers. Strategies: Round Robin (equal turns), Least Connections (to the server with fewest active connections), IP Hash (sticky sessions). Health checks remove unhealthy servers. L4 (TCP level) vs L7 (HTTP level — can route by URL path). Easy: Traffic cop directing cars to different checkout lanes based on which lane is shortest."
  },

  // ═══════════════════════════════════════════
  // TROUBLESHOOTING
  // ═══════════════════════════════════════════
  {
    cat: "Troubleshooting", diff: "Hard", company: "Meta",
    q: "The React application is dropping frames during large list scrolls. How do you debug and fix it?",
    refAnswer: "Diagnose: use Chrome DevTools Performance tab to identify long frames. Check for expensive renders. Fix: (1) Virtualization via react-window or react-virtual (only render visible rows). (2) Memoize components with React.memo and useMemo. (3) Avoid inline functions/objects causing unnecessary re-renders. (4) Use CSS contain: strict. (5) useTransition for non-urgent updates. Easy: Only paint what the user can see; memoize everything else."
  },
  {
    cat: "Troubleshooting", diff: "Hard", company: "Amazon",
    q: "A microservice's API latency spikes every 5 minutes. How do you diagnose it?",
    refAnswer: "Periodic pattern = scheduled job or GC pause. Steps: (1) Check infrastructure metrics (CPU, memory) — look for GC events. (2) Check if a cron job or cache refresh fires every 5 min. (3) Review dependency calls (DB queries, downstream APIs) for corresponding latency. (4) Add distributed tracing (X-Ray/Jaeger) to isolate the slow span. Fix candidates: tune GC, stagger batch jobs, add caching. Easy: Periodic spikes are almost always a scheduled task, GC pause, or cache miss stampede."
  },
  {
    cat: "Troubleshooting", diff: "Medium", company: "Google",
    q: "How would you debug a 503 Service Unavailable error in a distributed system?",
    refAnswer: "503 = server exists but can't handle request. Step 1: Check load balancer health — are backends healthy? Step 2: Check server CPU/memory — are servers overloaded? Step 3: Check connection limits — is the thread pool or connection pool exhausted? Step 4: Check upstream dependencies — is a DB or 3rd party service down? Do you have circuit breakers open? Step 5: Check recent deployments — did a deploy cause a crash loop? Easy: 503 means 'I'm overwhelmed or broken' — find the bottleneck in the chain."
  },
  {
    cat: "Troubleshooting", diff: "Hard", company: "Generic",
    q: "Your database is causing high CPU usage. How do you investigate?",
    refAnswer: "(1) Run SHOW PROCESSLIST (MySQL) or pg_stat_activity (Postgres) — find long-running queries. (2) EXPLAIN ANALYZE the slow queries — look for Seq Scans indicating missing indexes. (3) Check for lock contention — waiting queries. (4) Review recent schema changes or new queries. (5) Check for N+1 query problems from the ORM. Fix: add indexes, rewrite queries, add read replicas, cache results. Easy: Find the most expensive SQL statement and figure out why it's doing so much work."
  },
  {
    cat: "Troubleshooting", diff: "Medium", company: "Generic",
    q: "How would you investigate a Memory Leak in a Node.js application?",
    refAnswer: "Symptoms: memory grows monotonically, eventually OOM crash. Diagnosis: (1) Take heap snapshots at different times using Chrome DevTools or --inspect with Node. (2) Compare snapshots — what grew? (3) Look for growing arrays/maps/event listeners never removed. (4) Check for closures keeping references alive. Fix: remove event listeners on cleanup, use WeakMaps, avoid global caches without eviction. Easy: Take X-rays of memory over time and look for what's accumulating that shouldn't be."
  },

  // ═══════════════════════════════════════════
  // GENERAL BEHAVIORAL
  // ═══════════════════════════════════════════
  {
    cat: "Behavioral", diff: "Medium", company: "Generic",
    q: "Describe your most technically challenging project.",
    refAnswer: "STAR: Choose a project with genuine technical depth. Structure: what the challenge was (scale, complexity, unknowns), what you specifically did to solve it (not the team), and the concrete measurable outcome. Pro tip: pick something that required learning — shows growth mindset. Avoid generic answers like 'we built a CRUD app'."
  },
  {
    cat: "Behavioral", diff: "Easy", company: "Generic",
    q: "Where do you see yourself in 5 years?",
    refAnswer: "Be honest but align with the role. For IC: 'I see myself becoming a senior/principal engineer with deep expertise in distributed systems, mentoring junior engineers.' For management track: mention team leadership. Key: Show ambition that is achievable within the company's career ladder — don't say 'CEO' unless it's a startup. Easy: Show you want to grow, contribute, and build — within a reasonable scope."
  },
  {
    cat: "Behavioral", diff: "Medium", company: "Generic",
    q: "Tell me about a time you had to learn a new technology quickly.",
    refAnswer: "STAR: Describe the urgency (e.g., a project required a technology you hadn't used). Show your learning strategy: official docs first, then small spike/PoC, then bring to team. Quantify: 'within 2 weeks I had shipped a working prototype'. Key: Shows adaptability and resourcefulness. Tip: mention what you specifically learned and how it grew your mental model."
  },
  {
    cat: "Behavioral", diff: "Hard", company: "Generic",
    q: "How do you handle working with someone who consistently underperforms in your team?",
    refAnswer: "First: have a direct, private, empathetic conversation to understand root cause (unclear expectations? personal issues? wrong role?). Then: provide specific actionable feedback with clear expectations. Involve manager if needed. Document conversations. If no improvement after reasonable time, escalate honestly. Key: Show both directness and compassion. Avoid 'I just tell my manager' — shows avoidance."
  },
  {
    cat: "Behavioral", diff: "Medium", company: "Generic",
    q: "How do you prioritize when you have multiple competing deadlines?",
    refAnswer: "Framework: (1) Clarify urgency vs importance (Eisenhower Matrix). (2) Communicate early with stakeholders — don't wait to miss a deadline. (3) Identify dependencies and unblock the critical path first. (4) If truly overloaded, escalate and get help rather than silently failing. Easy: Sort by 'what breaks if I don't do it now' and talk to the people affected by any delays early."
  },
  {
    cat: "Behavioral", diff: "Easy", company: "Generic",
    q: "What is your greatest weakness, and how are you working on it?",
    refAnswer: "Be genuine — pick a real (not 'I work too hard') weakness that doesn't undermine core job competency. Structure: name the weakness, explain its impact, describe the concrete mitigation you've built (e.g., 'I tend to over-engineer early — now I timeboxed spikes to 2 hours and check with stakeholders before deep dives'). Easy: HR wants to see self-awareness and proactive growth, not perfection."
  },

  // ═══════════════════════════════════════════
  // REACT / FRONTEND
  // ═══════════════════════════════════════════
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "What is the Virtual DOM in React and how does it improve performance?",
    refAnswer: "Virtual DOM: an in-memory JS object representation of the real DOM. On state change, React creates a new vDOM, diffs it against the previous (Diffing algorithm / Fiber), and only updates the real DOM with the minimal set of changes (Reconciliation). This avoids costly full DOM repaints. Easy: React keeps a blueprint and only patches the real building where the blueprint changed."
  },
  {
    cat: "Technical", diff: "Hard", company: "Meta",
    q: "Explain React's useCallback and useMemo. When would you use each?",
    refAnswer: "useMemo: memoizes the result of an expensive computation. Re-computes only when dependencies change. useCallback: memoizes a function reference. Prevents child components (wrapped in React.memo) from re-rendering due to a new function reference on every parent render. Use useMemo for heavy calculations; useCallback when passing stable callbacks to memoized children. Easy: Both cache things — useMemo caches values, useCallback caches functions."
  },
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "What are React Hooks? Why were they introduced?",
    refAnswer: "Hooks (React 16.8+): functions that let function components use state and lifecycle features. Key hooks: useState (local state), useEffect (side effects), useContext (context access), useRef (mutable ref without re-render). Introduced to: eliminate class component complexity, enable code reuse via custom hooks, remove confusing 'this' binding. Easy: Hooks let function components do everything class components could, but more cleanly."
  },

  // ═══════════════════════════════════════════
  // PYTHON / BACKEND
  // ═══════════════════════════════════════════
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "What is Python's GIL (Global Interpreter Lock) and how does it affect multithreading?",
    refAnswer: "GIL: a mutex that prevents multiple native threads from executing Python bytecode simultaneously. One thread runs Python at a time. Impact: CPU-bound tasks don't benefit from threading — use multiprocessing instead. I/O-bound tasks (network, disk) do benefit because GIL is released during I/O wait. Async/await (asyncio) is preferred for I/O concurrency. Easy: Python multithreading is great for waiting; use multiprocessing for actual number-crunching."
  },
  {
    cat: "Technical", diff: "Easy", company: "Generic",
    q: "What is the difference between a list and a tuple in Python?",
    refAnswer: "List: mutable (can add/remove/change elements), dynamic size, uses more memory. Tuple: immutable (can't change after creation), slightly faster and uses less memory due to fixed allocation. Tuples are hashable (can be dict keys or set elements). Use tuple for fixed data (coordinates, RGB), list for dynamic collections. Easy: Tuple = a locked record. List = editable spreadsheet row."
  },
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "Explain Python's '@' decorator syntax and give a use case.",
    refAnswer: "A decorator is a higher-order function that wraps another function, adding behavior before/after. Syntax: @my_decorator above def my_func() is equivalent to my_func = my_decorator(my_func). Common uses: @app.route (Flask routing), @login_required (auth), @cache (memoization), @retry (resilience), @dataclass (auto-generating methods). Easy: A decorator is like a wrapper that adds instructions before and after opening a gift."
  },
  // ═══════════════════════════════════════════
  // MORE DSA — LEETCODE PATTERNS
  // ═══════════════════════════════════════════
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "Find All Anagrams in a String: find all start indices of anagrams of p in s.",
    refAnswer: "Sliding window of size p.length. Use two frequency hashmaps (or arrays of 26). Add right char, remove left char as window slides. If freq maps match, record left index. Time O(n). Easy: Keep a fixed-width window that slides right, comparing letter frequencies to the target word's frequencies."
  },
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "Longest Palindromic Substring.",
    refAnswer: "Expand around center: for each index i, try odd-length (center=i) and even-length (center=i,i+1) palindromes. Expand while chars match. Track max. Time O(n²). Manacher's algorithm achieves O(n). Easy: For every character, try to expand a palindrome outward — like pushing two hands apart from a center."
  },
  {
    cat: "DSA", diff: "Hard", company: "LeetCode",
    q: "Trapping Rain Water: given height array, compute total water trapped.",
    refAnswer: "Two pointer approach: left and right pointers. Track left_max and right_max. If left_max < right_max: water at left = left_max - height[left], move left inward. Else: water at right = right_max - height[right], move right inward. Time O(n), Space O(1). Easy: Water level is determined by the shorter wall — process from whichever side is shorter."
  },
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "Subsets: generate all possible subsets (power set) of a given array.",
    refAnswer: "Backtracking: at each index, choose to include or exclude the element. Recursively build subsets. Or iteratively: start with [[]], for each num, add num to all existing subsets and append those. Time O(2^n). Easy: For each element you have exactly two choices — in or out. Explore every combination."
  },
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "Letter Combinations of a Phone Number.",
    refAnswer: "Backtracking over the digits. Use a map digit→letters. For each digit, try each letter, recurse for the next digit, then backtrack. Base case: current combination length equals digits length. Time O(4^n * n). Easy: Build a tree of choices — at each level pick one letter for the current digit."
  },
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "Word Search: find if a word exists in a 2D character grid.",
    refAnswer: "DFS + backtracking. At each cell matching word[0], DFS in 4 directions. Mark cell as visited (e.g., temp replace with '#'), recurse for remaining word. Restore cell after recursion. Time O(M*N*4^L) where L=word length. Easy: Walk the grid letter by letter, backtrack if you hit a dead end."
  },
  {
    cat: "DSA", diff: "Hard", company: "LeetCode",
    q: "N-Queens: place N queens on NxN board so no two queens attack each other.",
    refAnswer: "Backtracking: place queens row by row. Track which columns, diagonals (row-col), and anti-diagonals (row+col) are occupied using sets. At each row, try each valid column. Backtrack when stuck. Time O(N!). Easy: Place one queen per row, keeping a 'blocked' record — backtrack when no safe column exists."
  },
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "Decode Ways: count how many ways a digit string can be decoded (1=A, 2=B, ..., 26=Z).",
    refAnswer: "DP. dp[i] = number of ways to decode s[:i]. If s[i-1] != '0': dp[i] += dp[i-1] (single digit). If 10 <= int(s[i-2:i]) <= 26: dp[i] += dp[i-2] (two digits). Base: dp[0]=1, dp[1]=0 or 1. Easy: At each position, decide whether to decode the last one or two characters."
  },
  {
    cat: "DSA", diff: "Medium", company: "LeetCode",
    q: "House Robber: maximize money robbed from houses where you can't rob adjacent ones.",
    refAnswer: "DP. rob(i) = max(rob(i-2) + nums[i], rob(i-1)). Either rob house i (and skip i-1) or skip house i (take whatever was best at i-1). Space optimize to two variables. Time O(n), Space O(1). Easy: At each house, compare 'money from two houses ago + this house' vs 'best without this house'."
  },
  {
    cat: "DSA", diff: "Medium", company: "Google",
    q: "Rotting Oranges: find minimum minutes for all oranges to rot (BFS from all rotten oranges simultaneously).",
    refAnswer: "Multi-source BFS: start with all initially rotten oranges in the queue simultaneously. Each minute, spread rot to adjacent fresh oranges. Track elapsed minutes. At the end, if any fresh orange remains, return -1. Time O(M*N). Easy: Think of all rotten oranges as spreading simultaneously like multiple infection sources."
  },
  {
    cat: "DSA", diff: "Medium", company: "Amazon",
    q: "Pacific Atlantic Water Flow: find which cells can drain to both the Pacific and Atlantic oceans.",
    refAnswer: "Reverse BFS/DFS from ocean borders. Start BFS from all Pacific-border cells, mark reachable cells. Repeat from Atlantic-border cells. Answer = intersection of both reachable sets. Easy: Instead of water flowing down, think of water flowing up from each ocean — find where both oceans' water can reach."
  },

  // ═══════════════════════════════════════════
  // CLOUD / DEVOPS
  // ═══════════════════════════════════════════
  {
    cat: "Technical", diff: "Medium", company: "Amazon",
    q: "Explain the difference between AWS EC2, ECS, and Lambda.",
    refAnswer: "EC2: raw virtual machines, full OS control, you manage everything including scaling. ECS (Elastic Container Service): runs Docker containers on a managed cluster (on EC2 or Fargate). Lambda: serverless functions, event-triggered, no server management, pay per invocation. Choose: Lambda for event-driven short tasks, ECS for long-running containerized apps, EC2 for full control or legacy apps. Easy: EC2=rent a car, ECS=hire a driver with your car, Lambda=take a taxi when needed."
  },
  {
    cat: "Technical", diff: "Hard", company: "Amazon",
    q: "What is Infrastructure as Code (IaC) and what tools are used?",
    refAnswer: "IaC: defining and provisioning infrastructure via code files (not manual UI clicks). Benefits: reproducibility, version control, disaster recovery, audit trail. Tools: Terraform (cloud-agnostic, declarative HCL), AWS CloudFormation (AWS-native), Pulumi (code in real languages). Key concepts: declarative (describe desired state) vs imperative (describe steps). Easy: Write your server setup like a recipe — anyone can recreate the exact same kitchen from the recipe."
  },
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "What is a CI/CD pipeline and what are its stages?",
    refAnswer: "CI (Continuous Integration): automatically build and test code on every commit. Identifies integration errors early. CD (Continuous Delivery/Deployment): automatically deploy to staging or production after CI passes. Typical stages: Source (git push) → Build (compile) → Test (unit/integration) → Security Scan → Staging Deploy → Smoke Test → Production Deploy. Tools: GitHub Actions, Jenkins, GitLab CI, CircleCI. Easy: An assembly line that takes raw code and delivers it to production automatically after quality checks."
  },
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "Explain the concept of blue-green deployment.",
    refAnswer: "Maintain two identical production environments: Blue (current live) and Green (new version). Deploy new version to Green. Test Green thoroughly. Switch traffic from Blue to Green (DNS/load balancer). Blue becomes standby — instant rollback if Green has issues. Benefits: zero downtime, instant rollback. Cost: double infrastructure during switch. Easy: Always have a backup restaurant ready — when the new one opens, redirect all customers and keep the old one warm just in case."
  },
  {
    cat: "Technical", diff: "Hard", company: "Generic",
    q: "What is observability in distributed systems? What are its three pillars?",
    refAnswer: "Observability: ability to understand internal system state from external outputs. Three pillars: (1) Logs — discrete events with timestamps (ELK stack, CloudWatch Logs). (2) Metrics — numerical measurements over time (Prometheus, DataDog). (3) Traces — end-to-end request journey across services (Jaeger, X-Ray). Good observability means debugging production issues without code changes. Easy: Logs are the diary, metrics are the health dashboard, traces are the GPS tracking of each request."
  },

  // ═══════════════════════════════════════════
  // FRONTEND ADVANCED
  // ═══════════════════════════════════════════
  {
    cat: "Technical", diff: "Medium", company: "Meta",
    q: "What is the difference between server-side rendering (SSR) and client-side rendering (CSR)?",
    refAnswer: "CSR: browser downloads empty HTML + JS bundle, JS renders page in browser. SEO-poor, slow first load, fast subsequent. SSR: server renders full HTML for each request, browser gets complete page. Better SEO, faster FCP but higher server load. Hybrid: Next.js SSR + CSR + Static Generation (SSG). Easy: CSR = server ships an empty frame and a kit; CSR = server ships a fully painted room."
  },
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "What is CSS specificity and how is it calculated?",
    refAnswer: "Specificity determines which CSS rule wins when multiple rules apply. Calculated as (A, B, C): A = inline styles (1,0,0), B = IDs (0,1,0), C = classes/attributes/pseudo-classes (0,0,1). Elements/pseudo-elements (0,0,0). Higher specificity wins; ties broken by order (later wins). !important overrides everything. Easy: ID beats class beats element — think of it as a score sheet where each type has a different point value."
  },
  {
    cat: "Technical", diff: "Hard", company: "Generic",
    q: "What is the browser's Critical Rendering Path and how do you optimize it?",
    refAnswer: "CRP: HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite. Optimizations: (1) Eliminate render-blocking resources (defer/async JS). (2) Minify CSS/JS/HTML. (3) Use critical CSS inline. (4) Lazy load below-fold images. (5) Use HTTP/2 for parallel requests. (6) Use CDN. Key metric: First Contentful Paint (FCP). Easy: Get the browser to paint the visible part of the page as fast as possible — don't make it wait for things it doesn't need immediately."
  },
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "What are Web Workers and when would you use them?",
    refAnswer: "Web Workers: JavaScript that runs in a background thread, separate from the main thread. They can't access the DOM. Communication via postMessage(). Use for: heavy computations (image processing, encryption, large data sorting) that would freeze the UI if run on the main thread. Easy: Hire a specialist to do heavy lifting in the back room so your front-of-house (UI) stays fast and responsive."
  },
  {
    cat: "Technical", diff: "Medium", company: "Meta",
    q: "Explain React's Context API and when to use it versus Redux.",
    refAnswer: "Context API: built-in React mechanism for sharing state across component tree without prop drilling. Best for: low-frequency updates (theme, user, locale). Redux: centralized store with strict predictability (actions, reducers). Best for: complex state, high-frequency updates, time-travel debugging, large teams. Context re-renders all consumers on change; use memo/split contexts to optimize. Easy: Context is a shared billboard; Redux is a carefully managed central database with an audit log."
  },

  // ═══════════════════════════════════════════
  // BEHAVIORAL — STARTUP / PM SCENARIOS
  // ═══════════════════════════════════════════
  {
    cat: "Behavioral", diff: "Hard", company: "Generic",
    q: "How do you decide what NOT to build?",
    refAnswer: "Framework: Start with opportunity cost — every feature you build means something else you don't. Use ICE scoring (Impact, Confidence, Ease) or RICE (Reach × Impact × Confidence / Effort) to rank. Say no to: low-impact features, features that 5% of users need and 95% won't, features with high technical debt. Show a specific example where you killed a feature that was almost built. Easy: Every 'yes' is a 'no' to something else — know your highest-leverage opportunities."
  },
  {
    cat: "Behavioral", diff: "Medium", company: "Generic",
    q: "Tell me about a time you had to give critical feedback to a senior person.",
    refAnswer: "STAR: Set the scene (their senior seniority, the stakes). Show you prepared — documented specific behavior/data, chose an appropriate private setting, used SBI framework (Situation-Behavior-Impact). Emphasize you made it about impact not personality. Show the outcome: they received it well or at least professionally, and describe any improvement. Easy: Prepare data, be private, focus on behavior and impact — never make it personal."
  },
  {
    cat: "Behavioral", diff: "Medium", company: "Generic",
    q: "Describe a time you successfully led a cross-functional team.",
    refAnswer: "STAR: Highlight that you coordinated Engineering, Design, Product, and/or Business without formal authority. Describe how you created alignment — shared OKRs, regular syncs, a RACI matrix. Emphasize how you managed competing priorities across teams. Key metrics: delivered on time, cross-team NPS improved, or reduced inter-team friction. Easy: Show you can translate between technical and non-technical stakeholders and build shared goals."
  },
  {
    cat: "Behavioral", diff: "Hard", company: "Google",
    q: "How do you approach a problem you've never seen before?",
    refAnswer: "Structure your thinking: (1) Understand the problem fully before solving. (2) Decompose into known sub-problems. (3) Think aloud — share your reasoning. (4) Start with brute force, then optimize. (5) If truly stuck, identify what you need to learn and how quickly you can learn it. Key: demonstrate meta-learning skills, not just pre-existing knowledge. Easy: 'I don't know' is okay — 'Here's how I'd figure it out' is what they're hiring for."
  },
  {
    cat: "Behavioral", diff: "Medium", company: "Amazon",
    q: "Tell me about a time you innovated on behalf of the customer. (LP: Invent and Simplify)",
    refAnswer: "STAR: Identify a customer pain point that wasn't on anyone's roadmap. Describe how you invented a simple solution — not over-engineered. Emphasize simplicity: Amazon values Ockham's razor in engineering. Quantify the customer impact. Key: differentiate between 'we added features' and 'we removed friction'. Easy: The best innovation often removes steps or complexity rather than adding them."
  },

  // ═══════════════════════════════════════════
  // ADDITIONAL SYSTEM DESIGN
  // ═══════════════════════════════════════════
  {
    cat: "System Design", diff: "Hard", company: "Meta",
    q: "Design a Facebook-scale Chat System (like WhatsApp/Messenger).",
    refAnswer: "Components: WebSocket servers for real-time bidirectional connection. Message DB (Cassandra — write-heavy, wide-column). User presence service (Redis TTL). Push notifications for offline users. Group chats: fan-out on write (deliver to all members' inboxes). Message ordering: use server-side timestamp + unique ID. Media: upload to blob store (S3), share URL. Easy: Persistent socket connections for real-time, reliable storage for history, push fallback for offline."
  },
  {
    cat: "System Design", diff: "Hard", company: "Google",
    q: "Design Google Maps / Route Navigation.",
    refAnswer: "Map tiles: pre-rendered image tiles served from CDN by zoom/lat/lng. Routing: offline-computed shortest path graph (Dijkstra/A*) updated by traffic data. Real-time traffic: aggregate GPS pings from millions of phones. ETA: ML model trained on historical travel times. Geocoding: address → lat/lng DB. Easy: Pre-render map images globally, pre-compute routes using road graphs, refine ETAs using live traffic crowdsourced from phones in real time."
  },
  {
    cat: "System Design", diff: "Medium", company: "Generic",
    q: "Design a Pastebin-like service.",
    refAnswer: "API: POST /paste (content, expiry) → returns unique URL. Storage: Key-Value store (Redis for hot/recent, S3 for cold/large). Key generation: Base62-encoded random ID (6 chars = 62^6 = ~56B unique keys). Expiry: TTL in Redis. Analytics: track view counts. CDN for read-heavy traffic. Easy: Generate a short random key, store content at that key, serve it on request — simple and fast."
  },
  {
    cat: "System Design", diff: "Hard", company: "Amazon",
    q: "Design a Recommendation System (like Amazon or Netflix).",
    refAnswer: "Approaches: (1) Collaborative Filtering: users who liked X also liked Y. (2) Content-Based: recommend similar item attributes. (3) Hybrid. Architecture: Offline pipeline (Spark jobs compute item-item or user-item similarity matrix nightly). Online serving: retrieve top-K candidates, re-rank with real-time features (recency, CTR, inventory). Cache top recommendations per user in Redis. Easy: Pre-compute 'similar items' overnight, then personalize rankings in real time based on what the user just did."
  },

  // ═══════════════════════════════════════════
  // MACHINE LEARNING BASICS (for ML roles)
  // ═══════════════════════════════════════════
  {
    cat: "Technical", diff: "Medium", company: "Google",
    q: "What is the difference between precision and recall?",
    refAnswer: "Precision = TP / (TP + FP): of everything the model predicted as positive, how many were actually positive? Recall = TP / (TP + FN): of all real positives, how many did the model catch? Precision-Recall tradeoff: lowering threshold increases recall but decreases precision. Use F1 score to balance both. Easy: Precision = 'How often is my alarm right when it rings?' Recall = 'How often does my alarm ring when there IS a fire?'"
  },
  {
    cat: "Technical", diff: "Hard", company: "Meta",
    q: "Explain the vanishing gradient problem in neural networks and how to address it.",
    refAnswer: "During backprop in deep networks, gradients (derivatives) get multiplied many times through layers. If weights/activations are small, these products approach 0 — earlier layers learn painfully slowly or stop. Solutions: (1) ReLU activation (doesn't saturate for positive values). (2) Batch Normalization (normalizes layer inputs). (3) Residual connections / skip connections (ResNet). (4) Better weight initialization (Xavier, He). Easy: Tiny numbers multiplied together shrink to zero — use tricks that keep gradients healthy as they flow back through the network."
  },
  {
    cat: "Technical", diff: "Medium", company: "Generic",
    q: "What is overfitting in machine learning and how do you prevent it?",
    refAnswer: "Overfitting: model memorizes training data including noise — performs great on training set, poorly on unseen data. Prevention: (1) More training data. (2) Regularization (L1/Lasso, L2/Ridge — penalizes large weights). (3) Dropout (randomly deactivate neurons during training). (4) Early stopping. (5) Cross-validation. (6) Simpler model (reduce parameters). Easy: The model studied the past exams (training data) so hard it memorized answers instead of understanding the concepts."
  },

  // ═══════════════════════════════════════════
  // NEGOTIATION-ADJACENT BEHAVIORAL
  // ═══════════════════════════════════════════
  {
    cat: "Behavioral", diff: "Medium", company: "Generic",
    q: "How would you negotiate for higher compensation?",
    refAnswer: "Framework: (1) Research market rates (Levels.fyi, Glassdoor, Blind) for the specific role/level/location. (2) Get competing offers if possible — anchors negotiation. (3) State your ask with justification, not just a number: 'Based on my research and my 7 years in distributed systems, I was expecting X'. (4) Negotiate the whole package: base, equity, bonus, signing bonus, PTO. (5) Never accept on the spot; take 24-48 hours. Easy: Know your worth with data, ask confidently, and remember everything is negotiable."
  },
  {
    cat: "Behavioral", diff: "Easy", company: "Generic",
    q: "Tell me about yourself.",
    refAnswer: "Structure: Past → Present → Future. Past: 1-2 most relevant experiences (academic or professional). Present: current role/project and what you're working on. Future: what excites you about this opportunity and why now. Keep to 90 seconds max. Tailor to the company — highlight what's most relevant to them. Easy: Think of it as a highlights reel of your career that naturally leads into 'and that's why I'm here talking to you today'."
  },
  {
    cat: "Behavioral", diff: "Medium", company: "Generic",
    q: "Do you have any questions for us?",
    refAnswer: "Always have questions. Strong questions: 'What does success look like in the first 90 days?' / 'What are the biggest technical challenges the team is facing right now?' / 'How does the team handle technical debt?' / 'What's your engineering culture around code reviews and testing?' / 'What are the opportunities for growth in this role?' Never ask about salary at this stage (unless they bring it up). Easy: Ask questions that show you've done research and are genuinely curious about their specific challenges, team, and growth."
  },
];

export const COMPANIES = Array.from(new Set(BANK.map(q => q.company))).sort();
