---
title: Start Here
subtitle: How to find a dataset for your research question
---

Once you have a question in mind and a theory you want to test, the next step is to find data that let you check the empirical implications of your argument. There are three ways to get there.

## 1. Use an existing dataset

Most of the time, someone has already collected data on the concept you care about. [Find Data](../) lists many of the most widely used sources in American politics, comparative politics, and international relations.

- **Search by concept, not just by dataset name.** Typing *corruption* or *turnout* shows every source with a relevant variable.
- **Think about what one row is.** A survey has one row per person; a cross-national dataset usually has one row per country per year (a *country-year*); event data has one row per protest, attack, or battle. Your research question determines which you need. Use the "What is one row?" filter.
- **Look for replication data.** If your question builds on a specific published article, the authors' data and code are often public. Search the [Harvard Dataverse](https://dataverse.harvard.edu/) for the article title or author, or check the journal's website and the authors' own pages. This is especially likely for recent articles.
- **Not sure where to begin?** The [QoG Data Finder](https://datafinder.qog.gu.se/) lets you search by concept across hundreds of datasets, and the [QoG Standard Dataset](https://www.gu.se/en/quality-government/qog-data) merges 2,000+ country-year variables into a single file. For U.S. states, the [Correlates of State Policy](https://ippsr.msu.edu/public-policy/correlates-state-policy) dataset plays the same role.

## 2. Collect your own data

Collecting your own data can be time-consuming, but it is also rewarding, and tools often exist to help automate the process. Know what the end product should look like before you start. For most projects it is a spreadsheet saved as a **.csv** file:

- the **first row** holds the variable names (one per column);
- **each following row** is one observation (one country-year, one person, one bill…);
- **each column** is one variable.

A file in that shape loads directly into R, Stata, or any other statistics program.

## 3. Combine datasets

You will often need to **merge** information from one dataset into another, for example adding GDP from the World Development Indicators to democracy scores from V-Dem. You may also need to **aggregate** information up to a higher level of analysis, such as averaging individual survey responses to the country level. To merge, both files need a shared identifier (country name or code, plus year). Watch out for countries that are spelled differently across sources.

## Getting help

[OU Libraries' Research Data Support](https://oakland.libguides.com/RDS) can help you locate data, and the library's [A–Z database list](https://oakland.libguides.com/az/databases) gives access to subscription sources marked "Through OU Libraries" on this site.
