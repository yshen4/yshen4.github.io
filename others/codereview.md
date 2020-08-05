# Code review guide

## Goals of code review

There are many goals of peer review of committed code, here are some of them:
- Share knowledge
- Improve code quality
- Find accidental bugs
- Improve code consistency and maintenability
- Security check
- Regulatory check
- Mentoring and collaborating

While it is obvious, the following are not the goals for code review: 
- Peer review isn't to pick on the code committer, or slow down the process. 
- Peer review isn't to show the reviewers are senior than the committer. Peer review is classless. Many times, in this specific domain, the committer knows more than reviewers so s\he is more senior in the domain. 

## Prepare for code review

- Run necessary testing: unit test, integration test, and code difference check
- Describe the changes to help reviewers understand the context
- Limit code size to reduce reviewers' time and project progress 
- Reviewers need to understand the feature and program logic

## What to review?

Reviewing code is more of an art than a science. There are a lot to learn what to review. While there is no defined laws, we can follow a checklist:

Purpose:
- If the code achieves the business goal (new feature, refactoring, bugfix)?

Design:
- If the code is the only logic to achieve the goal? If not, why is it chosen?
- If the code can be abstracted or follows well-known design patterns?
- If the code covers all corner cases?
- If the code re-invents the wheel?
- If the code adds more dependencies? If so, can we decouple the dependencies?
- If the code adds tests for the new code or missed testing?
- If the code keeps backward compatibility?

Code standard:
- If the code follows the coding standard?
  - Consistent naming
  - Consistent interface signature (Optional<String> vs String)
  - Input validation: public methods
  - Input validation vs input assertion
  - ... 
- If the code self-explains itself? If not, does it have enough and clear comments?
- If the code relates any documentation changes?

Security:
- If the code enforce required authentication/authorization (API backend)?
- If the code follows best practices for frontend input handling?

The other rule is to keep the reviewing light and fast, focus more on the program logic instead of styling. Let automation tools to do styling check. 

## How to respond to peer review?

The purpose of peer review is to improve the change request. Therefore, don’t be offended by reviewer’s suggestions and take them seriously even if you don’t agree.
- Respond to the review comment: 
  - Fixed/Done/ACK
  - Ask more questions
  - Present the reason, and keep the code unchange.  
- In-person review or discussion if necessary

## Key issues

### About comments

Naturally, blocks of code whose purpose isn't clear should be commented. 

Some comments are useful for maintenability, code quality, and collaboration; but excessive comments, or useless ones that state the obvious clutter up code, which should be avoided.  
- Comment assumptions
- Comment public API signatures
- Comment public API response, especially failed or default response and exceptions
- Comment algorithm logic or constant values if not self-explaining
- Avoid comments on getter/setter or preconditioned/validated inputs
- Don't comment out code. 

### 

## Reference
- [on the effect of code reviews on company culture](https://blog.fullstory.com/what-we-learned-from-google-code-reviews-arent-just-for-catching-bugs/)
- [on formal security reviews](https://www.owasp.org/images/2/2e/OWASP_Code_Review_Guide-V1_1.pdf)
- [shorter guides](https://github.com/thoughtbot/guides/tree/master/code-review)
- [longer checklists](https://www.codeproject.com/Articles/524235/Codeplusreviewplusguidelines)
- [Best practices](https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/)
- [More best practices](https://www.atlassian.com/agile/software-development/code-reviews)
- [examples of code reviews gone wrong](https://blog.fogcreek.com/effective-code-reviews-9-tips-from-a-converted-skeptic/)
- [statistics on code review effectiveness for catching bugs](https://blog.codinghorror.com/code-reviews-just-do-it/)
- [palantir best practice](https://github.com/palantir/gradle-baseline/blob/develop/docs/best-practices/readme.md)
- [Google java style](https://google.github.io/styleguide/javaguide.html)
- [Website Security: 13 Ways to Improve Front End Security and Not Get Hacked](https://www.shopify.com/partners/blog/website-security)
